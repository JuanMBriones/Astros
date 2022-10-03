const Profesor = require('../../models/profesor');
const Clase = require('../../models/clase');
const HorarioB = require('../../models/horario_bloque');
const HorarioS = require('../../models/horario_semana');
const CustomError = require('../../middleware/customError');
const ctr = {};

// get profesores
ctr.getAll = () => async (req, res, next) => {
  const allProfessors = await Profesor.find().exec();
  res.status(200).json({allProfessors});
};

// get materias que puede dar un profesor
ctr.getProfMaterias = () => async (req, res, next) => {
  // expected: nomina profesor
  const {profesor} = req.body;
  const profCip = await Profesor.find({nomina: profesor}).
    distinct('cip').exec();
  const profMaterias = await Clase.find({cip: {'$in': profCip}}).exec();
  console.log(profMaterias);
  res.status(200).json({profMaterias});
};

// unassign a class from a professor
ctr.unassignProf = () => async (req, res, next) => {
  // expected: id materia, nomina profesor
  const {idMateria, profesor} = req.body;
  console.log(idMateria, profesor);

  let idProfesor = await Profesor.findOne({nomina: profesor}).
    select('_id').exec();
  idProfesor = idProfesor._id.toString();

  const cargaProfesor = await Profesor.findOne({_id: idProfesor}).
    select('carga_asig').exec();
  const cargaMateria = await Clase.findOne({_id: idMateria}).
    select('carga').exec();
  const newCarga = cargaProfesor.carga_asig - cargaMateria.carga;

  const updatedProf = await Profesor.findByIdAndUpdate(idProfesor,
    {$pull: {clases: idMateria}, carga_asig: newCarga}).exec();
  const updatedClase = await Clase.findByIdAndUpdate(idMateria,
    {$pull: {profesor: idProfesor}}).exec();

  if (!updatedProf) {
    throw new CustomError(500, 'Error updating Profesor');
  }
  if (!updatedClase) {
    throw new CustomError(500, 'Error updating Clase');
  }
  res.status(200).json({message: 'Materia and Profesor updated successfully'});
};


// assign a class to a professor
ctr.assignProf = () => async (req, res, next) => {
  // expected: id materia, nomina profesor
  const {idMateria, profesor} = req.body;
  console.log(idMateria, profesor);

  let idProfesor = await Profesor.findOne({nomina: profesor}).
    select('_id').exec();
  idProfesor = idProfesor._id.toString();

  // revisar que la clase no este ya asignada al mismo profesor
  const profAsignado = await Profesor.findOne({_id: idProfesor}).
    select('clases').exec();
  if (profAsignado.clases.includes(idMateria)) {
    throw new CustomError(400, 'Esta clase ya esta asignada a este profesor');
  }

  // revisar carga
  const cargaProfesor = await Profesor.findOne({_id: idProfesor}).
    select('carga_perm carga_asig').exec();
  const cargaMateria = await Clase.findOne({_id: idMateria}).
    select('carga').exec();
  const newCarga = cargaProfesor.carga_asig + cargaMateria.carga;
  if (newCarga > cargaProfesor.carga_perm) {
    throw new CustomError(400, 'Carga excedida');
  }

  // revisar empalme de horario
  let horarioProf = await getHorarioProf(profesor);
  horarioProf = horarioProf[1];

  let horarioMateria = await Clase.findOne({_id: idMateria}).
    select('horario').exec();
  horarioMateria = horarioMateria.horario;
  horarioMateria = await HorarioB.findOne({_id: horarioMateria}).exec();
  horarioMateria.horario_semana = await HorarioS.find({_id:
    {'$in': horarioMateria.horario_semana}}).exec();
  console.log(horarioMateria);
  console.log(horarioProf);

  if (horarioMateria.bloque == 0) {
    horarioMateria.horario_semana.forEach((horarioDia) => {
      horarioProf[0][horarioDia.dia-1].forEach((hora) => {
        const inicioMateria = horarioDia.hora_inicio.getTime();
        const inicioHorario = hora[0].getTime();
        const finMateria = horarioDia.hora_fin.getTime();
        const finHorario = hora[1].getTime();
        if (inicioMateria >= inicioHorario && inicioMateria <= finHorario ||
            finMateria >= inicioHorario && finMateria <= finHorario) {
          throw new CustomError(400, 'Emaplme de horario');
        }
      });
      horarioProf[1][horarioDia.dia-1].forEach((hora) => {
        if (inicioMateria >= inicioHorario && inicioMateria <= finHorario ||
            finMateria >= inicioHorario && finMateria <= finHorario) {
          throw new CustomError(400, 'Emaplme de horario');
        }
      });
      horarioProf[2][horarioDia.dia-1].forEach((hora) => {
        if (inicioMateria >= inicioHorario && inicioMateria <= finHorario ||
            finMateria >= inicioHorario && finMateria <= finHorario) {
          throw new CustomError(400, 'Emaplme de horario');
        }
      });
    });
  } else {
    horarioMateria.horario_semana.forEach((horarioDia) => {
      horarioProf[horarioMateria.bloque-1][horarioDia.dia-1].forEach((hora) => {
        const inicioMateria = horarioDia.hora_inicio.getTime();
        const inicioHorario = hora[0].getTime();
        const finMateria = horarioDia.hora_fin.getTime();
        const finHorario = hora[1].getTime();
        if (inicioMateria >= inicioHorario && inicioMateria <= finHorario ||
            finMateria >= inicioHorario && finMateria <= finHorario) {
          throw new CustomError(400, 'Emaplme de horario');
        }
      });
    });
  }

  // revisar 6 h seguidas
  horarioMateria.horario_semana.forEach((horarioDia) => {
    horarioProf[horarioMateria.bloque][horarioDia.dia-1].forEach((hora) => {
      const minsActual = (hora[1].getTime() - hora[0].getTime()) / 60000;
      const minsMateria = (horarioDia.hora_fin.getTime() -
        horarioDia.hora_inicio.getTime()) / 60000;
      if (minsActual + minsMateria >= 360) {
        throw new CustomError(400, '6 horas seguidas o mas');
      }
    });
  });

  // advertencia: se puede asignar materia ya asignada a otro profe?

  const updatedMat = await Clase.
    findByIdAndUpdate(idMateria, {$addToSet: {profesor: idProfesor}}).exec();
  const updatedProf = await Profesor.
    findByIdAndUpdate(idProfesor, {$addToSet: {clases: idMateria},
      carga_asig: newCarga}).exec();

  if (!updatedMat) {
    throw new CustomError(500, 'Error updating Materia');
  }
  if (!updatedProf) {
    throw new CustomError(500, 'Error updating Profesor');
  }
  res.status(200).json({message: 'Materia and Profesor updated successfully'});
};

// horario de un profesor
ctr.horarioProf = () => async (req, res, next) => {
  const profesor = req.query.profesor;

  let horarioProf = await getHorarioProf(profesor);

  horarioProf = horarioProf[0];
  console.log(horarioProf);
  res.status(200).json({horarioProf});
};

getHorarioProf = async (profesor) => {
  const profClasesIDs = await Profesor.find({nomina: profesor}).
    distinct('clases').exec();

  const profClases = await Clase.find({_id: {'$in': profClasesIDs}}).
    select('clave materia modalidad_grupo horario').exec();

  let horarioBloque = [];
  let horarioSemana = [];
  const horarioCompleto = [
    [[], [], [], [], [], [], []],
    [[], [], [], [], [], [], []],
    [[], [], [], [], [], [], []],
  ];

  for (let i=0; i<profClases.length; i++) {
    const horarioID = profClases[i].horario;
    horarioBloque = await HorarioB.find({_id: {'$in': horarioID}}).exec();

    for (let j=0; j<horarioBloque.length; j++) {
      const horarioSemanaID = horarioBloque[j].horario_semana;
      horarioSemana = await HorarioS.find({_id: {'$in': horarioSemanaID}}).
        exec();
      horarioBloque[j].horario_semana = horarioSemana;
      const bloque = horarioBloque[j].bloque;

      for (let k=0; k<horarioSemana.length; k++) {
        const dia = horarioSemana[k].dia-1;
        if (bloque == 0) {
          // la clase dura todo el semestre
          let horaInicio = horarioSemana[k].hora_inicio;
          let horaFin = horarioSemana[k].hora_fin;
          for (let l=0; l<horarioCompleto[0][dia].length; l++) {
            if (horaInicio.getTime() ==
                horarioCompleto[0][dia][l][1].getTime()) {
              horaInicio = horarioCompleto[0][dia][l][0];
              horarioCompleto[0][dia].splice(l, 1);
            } else if (horaFin.getTime() ==
                       horarioCompleto[0][dia][l][0].getTime()) {
              horaFin = horarioCompleto[0][dia][l][1];
              horarioCompleto[0][dia].splice(l, 1);
            }
          }
          horarioCompleto[0][dia].push([horaInicio, horaFin]);

          horaInicio = horarioSemana[k].hora_inicio;
          horaFin = horarioSemana[k].hora_fin;
          for (let l=0; l<horarioCompleto[1][dia].length; l++) {
            if (horaInicio.getTime() ==
                horarioCompleto[1][dia][l][1].getTime()) {
              horaInicio = horarioCompleto[1][dia][l][0];
              horarioCompleto[1][dia].splice(l, 1);
            } else if (horaFin.getTime() ==
                       horarioCompleto[1][dia][l][0].getTime()) {
              horaFin = horarioCompleto[1][dia][l][1];
              horarioCompleto[1][dia].splice(l, 1);
            }
          }
          horarioCompleto[1][dia].push([horaInicio, horaFin]);

          horaInicio = horarioSemana[k].hora_inicio;
          horaFin = horarioSemana[k].hora_fin;
          for (let l=0; l<horarioCompleto[2][dia].length; l++) {
            if (horaInicio.getTime() ==
                horarioCompleto[2][dia][l][1].getTime()) {
              horaInicio = horarioCompleto[2][dia][l][0];
              horarioCompleto[2][dia].splice(l, 1);
            } else if (horaFin.getTime() ==
                       horarioCompleto[2][dia][l][0].getTime()) {
              horaFin = horarioCompleto[2][dia][l][1];
              horarioCompleto[2][dia].splice(l, 1);
            }
          }
          horarioCompleto[2][dia].push([horaInicio, horaFin]);
        } else {
          // la clase dura 1 parcial
          let horaInicio = horarioSemana[k].hora_inicio;
          let horaFin = horarioSemana[k].hora_fin;
          for (let l=0; l<horarioCompleto[bloque-1][dia].length; l++) {
            if (horaInicio.getTime() ==
                horarioCompleto[bloque-1][dia][l][1].getTime()) {
              horaInicio = horarioCompleto[bloque-1][dia][l][0];
              horarioCompleto[bloque-1][dia].splice(l, 1);
            } else if (horaFin.getTime() ==
                       horarioCompleto[bloque-1][dia][l][0].getTime()) {
              horaFin = horarioCompleto[bloque-1][dia][l][1];
              horarioCompleto[bloque-1][dia].splice(l, 1);
            }
          }
          horarioCompleto[bloque-1][dia].push([horaInicio, horaFin]);
        }
      }
    }
    profClases[i].horario = horarioBloque;
  }

  return [profClases, horarioCompleto];
};

module.exports = ctr;

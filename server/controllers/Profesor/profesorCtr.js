const Profesor = require('../../models/profesor');
const Clase = require('../../models/clase');
const HorarioB = require('../../models/horario_bloque');
const HorarioS = require('../../models/horario_semana');
const CustomError = require('../../middleware/customError');
const ctr = {};

// duda
// carga es por periodo o por semestre?!!!!

// get profesores
ctr.getAll = () => async (req, res, next) => {
  const allProfessors = await Profesor.find().exec();
  res.status(200).json({allProfessors});
};

// get profesor especifico
ctr.getDataProfe = () => async (req, res, next) => {
  // expected: nomina profesor
  const profesor = req.query.profesor;
  const profe = await Profesor.findOne({nomina: profesor}).exec();
  res.status(200).json({profe});
};

// get materias que puede dar un profesor
ctr.getProfMaterias = () => async (req, res, next) => {
  // expected: nomina profesor
  const profesor = req.query.profesor;
  const profCip = await Profesor.find({nomina: profesor}).distinct('cip').exec();
  const profMaterias = await Clase.find({cip: {'$in': profCip}}).exec();
  console.log(profMaterias);
  res.status(200).json({profMaterias});
};

// unassign a class from a professor
ctr.unassignProf = () => async (req, res, next) => {
  // expected: id materia, nomina profesor
  const idMateria = req.query.idMateria;
  const profesor = req.query.profesor;
  console.log(idMateria, profesor);

  let idProfesor = await Profesor.findOne({nomina: profesor}).select('_id').exec();
  idProfesor = idProfesor._id.toString();

  const checkClase = await Clase.find({_id: idMateria, profesor: idProfesor}).exec();
  const checkProfe = await Profesor.find({_id: idProfesor, clases: idMateria}).exec();
  if (checkClase.length == 0 || checkProfe.length == 0) {
    throw new CustomError(400, 'El profesor no tiene asignada esa clase');
  }

  const cargaProfesor = await Profesor.findOne({_id: idProfesor}).select('carga_asig').exec();
  const cargaMateria = await Clase.findOne({_id: idMateria}).select('carga').exec();
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

const dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
ctr.warnings = () => async (req, res, next) => {
  // expected: nomina profesor
  const profesor = req.query.profesor;
  let idProfesor = await Profesor.findOne({nomina: profesor}).select('_id').exec();
  idProfesor = idProfesor._id.toString();

  const returnMsg = [];

  const cargaProfesor = await Profesor.findOne({_id: idProfesor}).select('carga_perm carga_asig').exec();
  const carga = cargaProfesor.carga_asig - cargaProfesor.carga_perm;
  if (carga > 0) {
    const unidad = carga > 1 ? ' unidades).' : ' unidad).';
    returnMsg.push('La carga asignada al profesor excede la permitida (por ' + carga + unidad);
  }

  let horarioProf = await getHorarioProf(profesor);
  horarioProf = horarioProf[1];

  for (let i = 0; i < horarioProf.length; i++) {
    console.log(horarioProf[i]);
    for (let j = 0; j < horarioProf[i].length; j++) {
      console.log(horarioProf[i][j]);
      for (let k = 0; k < horarioProf[i][j].length; k++) {
        const minsActual = (horarioProf[i][j][k][1].getTime() - horarioProf[i][j][k][0].getTime()) / 60000;
        if (minsActual >= 360) {
          returnMsg.push('Periodo ' + (i+1) +
          ': El profesor tiene una carga mayor a 6 horas seguidas el día: ' + dias[j] + '.');
        }
      }
    }
  }

  res.status(200).json({message: returnMsg});
};

// assign a class to a professor
ctr.assignProf = () => async (req, res, next) => {
  // expected: id materia, nomina profesor
  const idMateria = req.query.idMateria;
  const profesor = req.query.profesor;
  console.log(idMateria, profesor);

  let idProfesor = await Profesor.findOne({nomina: profesor}).select('_id').exec();
  idProfesor = idProfesor._id.toString();

  // revisar que la clase no este ya asignada al mismo profesor
  const profAsignado = await Profesor.findOne({_id: idProfesor}).select('clases').exec();
  if (profAsignado.clases.includes(idMateria)) {
    throw new CustomError(400, 'Esta clase ya esta asignada al profesor');
  }

  // revisar que la clase no este asignada ya a 2 profesores
  const cantProf = await Clase.findOne({_id: idMateria}).select('profesor').exec();
  if (cantProf.profesor.length > 1) {
    throw new CustomError(400, 'No se puede asignar una clase a mas de 2 profesores');
  }

  const returnMsg = [];

  // revisar carga
  const cargaProfesor = await Profesor.findOne({_id: idProfesor}).select('carga_perm carga_asig').exec();
  const cargaMateria = await Clase.findOne({_id: idMateria}).select('carga').exec();
  const newCarga = cargaProfesor.carga_asig + cargaMateria.carga;
  if (newCarga > cargaProfesor.carga_perm) {
    returnMsg.push('Carga excedida');
  }

  // revisar empalme de horario
  let horarioProf = await getHorarioProf(profesor);
  horarioProf = horarioProf[1];

  let horarioMateria = await Clase.findOne({_id: idMateria}).select('horario').exec();
  horarioMateria = horarioMateria.horario;
  horarioMateria = await HorarioB.findOne({_id: horarioMateria}).exec();
  horarioMateria.horario_semana = await HorarioS.find({_id: {'$in': horarioMateria.horario_semana}}).exec();
  console.log(horarioMateria);
  console.log(horarioProf);

  if (horarioMateria.bloque == 0) {
    // para cada dia que se imparte la materia
    horarioMateria.horario_semana.forEach((horarioDia) => {
      // para cada uno de los 6 periodos del semestre en ese dia
      for (let i = 0; i < 6; i++) {
        horarioProf[i][horarioDia.dia-1].forEach((hora) => {
          const inicioMateria = horarioDia.hora_inicio.getTime();
          const inicioHorario = hora[0].getTime();
          const finMateria = horarioDia.hora_fin.getTime();
          const finHorario = hora[1].getTime();
          if (inicioMateria >= inicioHorario && inicioMateria < finHorario ||
              inicioMateria < inicioHorario && finMateria > inicioHorario) {
            throw new CustomError(400, 'Empalme de horario');
          }
        });
      }
    });
  } else {
    horarioMateria.horario_semana.forEach((horarioDia) => {
      horarioProf[horarioMateria.bloque-1][horarioDia.dia-1].forEach((hora) => {
        const inicioMateria = horarioDia.hora_inicio.getTime();
        const inicioHorario = hora[0].getTime();
        const finMateria = horarioDia.hora_fin.getTime();
        const finHorario = hora[1].getTime();
        if (inicioMateria >= inicioHorario && inicioMateria < finHorario ||
            inicioMateria < inicioHorario && finMateria > inicioHorario) {
          throw new CustomError(400, 'Empalme de horario');
        }
      });
    });
  }

  // revisar 6 h seguidas
  if (horarioMateria.bloque == 0) {
    horarioMateria.horario_semana.forEach((horarioDia) => {
      for (let i = 0; i < 6; i++) {
        let inicioNewMateria = horarioDia.hora_inicio;
        let finNewMateria = horarioDia.hora_fin;
        for (let j = 0; j < horarioProf[i][horarioDia.dia-1].length; j++) {
          const horaInicio = horarioProf[i][horarioDia.dia-1][j][0];
          const horaFin = horarioProf[i][horarioDia.dia-1][j][1];
          if (inicioNewMateria.getTime() == horaFin.getTime()) {
            inicioNewMateria = horaInicio;
            horarioProf[i][horarioDia.dia-1].splice(j, 1);
            j--;
          } else if (finNewMateria.getTime() == horaInicio.getTime()) {
            finNewMateria = horaFin;
            horarioProf[i][horarioDia.dia-1].splice(j, 1);
            j--;
          }
        }
        horarioProf[i][horarioDia.dia-1].push([inicioNewMateria, finNewMateria]);

        horarioProf[i][horarioDia.dia-1].forEach((hora) => {
          const minsActual = (hora[1].getTime() - hora[0].getTime()) / 60000;
          if (minsActual >= 360) {
            returnMsg.push('6 o más horas seguidas');
          }
        });
      }
    });
  } else {
    horarioMateria.horario_semana.forEach((horarioDia) => {
      let inicioNewMateria = horarioDia.hora_inicio;
      let finNewMateria = horarioDia.hora_fin;
      for (let i = 0; i < horarioProf[horarioMateria.bloque-1][horarioDia.dia-1].length; i++) {
        const horaInicio = horarioProf[horarioMateria.bloque-1][horarioDia.dia-1][i][0];
        const horaFin = horarioProf[horarioMateria.bloque-1][horarioDia.dia-1][i][1];
        if (inicioNewMateria.getTime() == horaFin.getTime()) {
          inicioNewMateria = horaInicio;
          horarioProf[horarioMateria.bloque-1][horarioDia.dia-1].splice(i, 1);
          i--;
        } else if (finNewMateria.getTime() == horaInicio.getTime()) {
          finNewMateria = horaFin;
          horarioProf[horarioMateria.bloque-1][horarioDia.dia-1].splice(i, 1);
          i--;
        }
      }
      horarioProf[horarioMateria.bloque-1][horarioDia.dia-1].push([inicioNewMateria, finNewMateria]);

      horarioProf[horarioMateria.bloque-1][horarioDia.dia-1].forEach((hora) => {
        const minsActual = (hora[1].getTime() - hora[0].getTime()) / 60000;
        if (minsActual >= 360) {
          returnMsg.push('6 o más horas seguidas');
        }
      });
    });
  }

  // duda
  // advertencia: al asignarlo a una clase ya asignada a otro profe?
  // duda
  // empalme es advertencia o error?

  res.status(200).json({message: returnMsg, idMateria: idMateria, profesor: idProfesor, carga: newCarga});
};

ctr.assignConfirm = () => async (req, res, next) => {
  // expected: id materia, nomina profesor
  const idMateria = req.query.idMateria;
  const idProfesor = req.query.profesor;
  const newCarga = req.query.carga;
  console.log(idMateria, idProfesor, newCarga);

  const updatedMat = await Clase.findByIdAndUpdate(idMateria, {$addToSet: {profesor: idProfesor}}).exec();
  const updatedProf = await Profesor.findByIdAndUpdate(idProfesor,
    {$addToSet: {clases: idMateria}, carga_asig: newCarga}).exec();

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
  const profClasesIDs = await Profesor.find({nomina: profesor}).distinct('clases').exec();

  const profClases = await Clase.find({_id: {'$in': profClasesIDs}}).
    select('clave materia modalidad_grupo horario').exec();

  let horarioBloque = [];
  let horarioSemana = [];
  const horarioCompleto = [
    [[], [], [], [], [], [], []],
    [[], [], [], [], [], [], []],
    [[], [], [], [], [], [], []],
    [[], [], [], [], [], [], []],
    [[], [], [], [], [], [], []],
    [[], [], [], [], [], [], []],
  ];

  for (let i=0; i<profClases.length; i++) {
    const horarioID = profClases[i].horario;
    horarioBloque = await HorarioB.find({_id: {'$in': horarioID}}).exec();

    for (let j=0; j<horarioBloque.length; j++) {
      const horarioSemanaID = horarioBloque[j].horario_semana;
      horarioSemana = await HorarioS.find({_id: {'$in': horarioSemanaID}}).exec();
      horarioBloque[j].horario_semana = horarioSemana;
      const bloque = horarioBloque[j].bloque;

      for (let k = 0; k < horarioSemana.length; k++) {
        const dia = horarioSemana[k].dia-1;
        if (bloque == 0) {
          // la clase dura todo el semestre
          for (let m = 0; m < 6; m++) {
            let horaInicio = horarioSemana[k].hora_inicio;
            let horaFin = horarioSemana[k].hora_fin;
            for (let l = 0; l < horarioCompleto[m][dia].length; l++) {
              if (horaInicio.getTime() == horarioCompleto[m][dia][l][1].getTime()) {
                horaInicio = horarioCompleto[m][dia][l][0];
                horarioCompleto[m][dia].splice(l, 1);
              } else if (horaFin.getTime() == horarioCompleto[m][dia][l][0].getTime()) {
                horaFin = horarioCompleto[m][dia][l][1];
                horarioCompleto[m][dia].splice(l, 1);
              }
            }
            horarioCompleto[m][dia].push([horaInicio, horaFin]);
          }
        } else {
          // la clase dura 1 parcial
          let horaInicio = horarioSemana[k].hora_inicio;
          let horaFin = horarioSemana[k].hora_fin;
          for (let l = 0; l < horarioCompleto[bloque-1][dia].length; l++) {
            if (horaInicio.getTime() == horarioCompleto[bloque-1][dia][l][1].getTime()) {
              horaInicio = horarioCompleto[bloque-1][dia][l][0];
              horarioCompleto[bloque-1][dia].splice(l, 1);
              l--;
            } else if (horaFin.getTime() == horarioCompleto[bloque-1][dia][l][0].getTime()) {
              horaFin = horarioCompleto[bloque-1][dia][l][1];
              horarioCompleto[bloque-1][dia].splice(l, 1);
              l--;
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

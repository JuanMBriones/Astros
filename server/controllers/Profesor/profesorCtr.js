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
  const mail = req.query.mail;

  let profe = {};
  if (mail) {
    profe = await Profesor.findOne({correo: mail}).exec();
  } else {
    profe = await Profesor.findOne({nomina: profesor}).exec();
  }
  res.status(200).json({profe});
};

// get materias que puede dar un profesor
ctr.getProfMaterias = () => async (req, res, next) => {
  // expected: id profesor
  const profesor = req.query.profesor;
  const profCip = await Profesor.find({id: profesor}).distinct('cip').exec();
  const clases = await Clase.find({cip: {'$in': profCip}}).exec();
  for (let i = 0; i < clases.length; i++) {
    if (clases[i].profesor.includes(profesor)) {
      clases[i].asignada = 1;
    } else {
      clases[i].asignada = 0;
    }
    const bloque = await HorarioB.find({_id: {'$in': clases[i].horario}}).exec();
    const semana = await HorarioS.find({_id: {'$in': bloque[0].horario_semana}}).exec();
    const periodos = ['Todo el semestre', 'Periodo 1', 'Periodo 2', 'Periodo 3', 'Semana tec 1', 'Semana tec 2', 'Semana 18'];
    const horario = [[periodos[bloque[0].bloque]]];
    semana.forEach((dia) => {
      const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      const hi = dia.hora_inicio.toISOString().slice(11, 16);
      const hf = dia.hora_fin.toISOString().slice(11, 16);
      horario.push([dias[dia.dia-1], hi, hf]);
    });
    clases[i].horario = horario;
  }
  console.log(clases);
  res.status(200).json({clases});
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
  const idProfesor = req.query.profesor;
  const profesor = await Profesor.findOne({_id: idProfesor}).exec();
  const clase = await Clase.findOne({_id: idMateria}).exec();

  // revisar que la clase no este ya asignada al mismo profesor
  if (profesor.clases.includes(idMateria)) {
    throw new CustomError(400, 'Esta clase ya esta asignada al profesor');
  }

  // revisar que la clase no este asignada ya a 2 profesores
  if (clase.profesor.length > 1) {
    throw new CustomError(400, 'No se puede asignar una clase a mas de 2 profesores');
  }

  const returnMsg = [];

  // revisar carga
  const cargaPermitidaProfesor = profesor.carga_perm;
  const cargaAsignadaProfesor = profesor.carga_asig;
  const cargaMateria = clase.carga;
  const newCarga = cargaAsignadaProfesor + cargaMateria;
  if (newCarga > cargaPermitidaProfesor) {
    returnMsg.push('Carga excedida');
  }

  // revisar empalme de horario
  let horarioProf = await getHorarioProf(profesor.nomina);
  horarioProf = horarioProf[1];

  let horarioMateria = clase.horario;
  horarioMateria = await HorarioB.findOne({_id: {'$in': horarioMateria}}).exec();
  horarioMateria.horario_semana = await HorarioS.find({_id: {'$in': horarioMateria.horario_semana}}).exec();

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
  // expected: id materia, nomina profesor, newCarga
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
  console.log(updatedMat, updatedProf);
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

ctr.postProfesor = () => async (req, res, next) => {
  const {deptoProf, entrada, nomina, nombre, correo, cip, modalidad} = req.body;

  if (!deptoProf || !nomina || !nombre || !correo) {
    throw new CustomError(400, 'Missing parameters');
  }

  // check if profesor already exists
  const profesor = await Profesor.findOne({nomina: nomina}).exec();
  if (profesor) {
    throw new CustomError(400, 'Profesor already exists');
  }

  const newProfesor = new Profesor({
    depto_prof: deptoProf,
    entrada: entrada,
    nomina: nomina,
    nombre: nombre,
    correo: correo,
    cip: cip,
    modalidad: modalidad,
  });

  const savedProfesor = await newProfesor.save();
  if (!savedProfesor) {
    throw new CustomError(500, 'Error saving Profesor');
  }
  res.status(201).json({message: 'Profesor saved successfully'});
};

// give power to a profesor 🤑🔥
ctr.givePower = () => async (req, res, next) => {
  const {nomina} = req.body;

  if (!nomina) {
    throw new CustomError(400, 'Missing parameters');
  }

  const profesor = await Profesor.findOne({nomina: nomina}).exec();
  if (!profesor) {
    throw new CustomError(400, 'Profesor does not exist');
  }

  profesor.rol = 'admin';
  const savedProfesor = await profesor.save();
  if (!savedProfesor) {
    throw new CustomError(500, 'Error saving Profesor');
  }
  res.status(201).json({message: 'Profesor has been given a power up'});
};

ctr.nerfProfessor = () => async (req, res, next) => {
  const {nomina} = req.body;

  if (!nomina) {
    throw new CustomError(400, 'Missing parameters');
  }

  const profesor = await Profesor.findOne({nomina: nomina}).exec();
  if (!profesor) {
    throw new CustomError(400, 'Profesor does not exist');
  }

  profesor.rol = 'user';
  const savedProfesor = await profesor.save();
  if (!savedProfesor) {
    throw new CustomError(500, 'Error saving Profesor');
  }
  res.status(201).json({message: 'Profesor has been nerfed'});
};

ctr.isAdmin = () => async (req, res, next) => {
  console.log(req.body);
  const {nomina} = req.body; // body;

  if (!nomina) {
    throw new CustomError(400, 'Missing parameters');
  }

  const profesor = await Profesor.findOne({nomina: nomina}).exec();
  if (!profesor) {
    throw new CustomError(400, 'Profesor does not exist');
  }

  if (profesor.rol == 'admin') {
    res.status(200).json({message: 'Profesor is admin'});
    console.log('Profesor is admin');
  } else {
    res.status(200).json({message: 'Profesor is not admin'});
    console.log('Profesor is not admin');
  }
};

module.exports = ctr;

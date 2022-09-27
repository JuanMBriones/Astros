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

// assign a class to a professor
ctr.assignProf = () => async (req, res, next) => {
  // expected: id materia, nomina profesor
  const {idMateria, profesor} = req.body;
  console.log(idMateria, profesor);

  let idProfesor = await Profesor.find({nomina: profesor}).select('_id').exec();
  idProfesor = idProfesor[0]._id.toString();

  // revisar carga
  const cargaProfesor = await Profesor.find({nomina: profesor}).
    select('carga_perm carga_asig').exec();
  const cargaMateria = await Clase.find({_id: idMateria}).
    select('carga').exec();
  const newCarga = cargaProfesor[0].carga_asig + cargaMateria[0].carga;
  if (newCarga > cargaProfesor[0].carga_perm) {
    throw new CustomError(400, 'Carga excedida');
  }

  // todo: revisar 6 h seguidas
  let horarioProf = await getHorarioProf(profesor);
  horarioProf = horarioProf[1];
  console.log(horarioProf);
  // todo: revisar empalme de horario

  const updatedMat = await Clase.
    findByIdAndUpdate(idMateria, {profesor: idProfesor}).exec();
  const updatedProf = await Profesor.
    findByIdAndUpdate(idProfesor, {$addToSet: {clases: idMateria},
      carga_asig: newCarga}).exec();

  if (!updatedMat) {
    throw new CustomError(500, 'Error updating Materia');
  } else if (!updatedProf) {
    throw new CustomError(500, 'Error updating Profesor');
  } else {
    res.status(200).json({
      message: 'Materia and Profesor updated successfully',
      updatedMat, updatedProf,
    });
  }
};

// horario de un profesor
// https://localhost:5000/api/horarioProf
ctr.horarioProf = () => async (req, res, next) => {
  // expected: nomina profesor
  const {profesor} = req.body;
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
  const horarioCompleto = Array(7).fill([]);
  for (let i=0; i<profClases.length; i++) {
    // console.log(i); console.log(horarioCompleto);
    const horarioID = profClases[i].horario;
    horarioBloque = await HorarioB.find({_id: {'$in': horarioID}}).exec();
    for (let j=0; j<horarioBloque.length; j++) {
      const horarioSemanaID = horarioBloque[j].horario_semana;
      horarioSemana = await HorarioS.find({_id: {'$in': horarioSemanaID}}).
        exec();
      horarioBloque[j].horario_semana = horarioSemana;
      for (let k=0; k<horarioSemana.length; k++) {
        // console.log(horarioSemana[k].dia-1);
        const index = horarioSemana[k].dia-1;
        horarioCompleto[index] = horarioCompleto[index].
          concat([horarioSemana[k].hora_inicio, horarioSemana[k].hora_fin]);
      }
    }
    profClases[i].horario = horarioBloque;
  }

  // console.log(horarioCompleto);
  return [profClases, horarioCompleto];
};

module.exports = ctr;

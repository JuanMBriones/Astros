const Profesor = require('../../models/profesor');
const Clase = require('../../models/clase');
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
  const {id, profesor} = req.body;
  console.log(id, profesor);
  let idProfesor = await Profesor.find({nomina: profesor}).select('_id').exec();
  idProfesor = idProfesor[0]._id.toString();
  const updatedMat = await Clase.
    findByIdAndUpdate(id, {profesor: idProfesor}).exec();
  res.status(201).json({
    message: 'Materia updated successfully',
    updatedMat,
  });
};

module.exports = ctr;

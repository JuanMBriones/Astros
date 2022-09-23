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
  const {profesor} = req.body;
  const profCip = await Profesor.find({nomina: profesor}).
    distinct('cip').exec();
  const profMaterias = await Clase.find({cip: {'$in': profCip}}).exec();
  console.log(profMaterias);
  res.status(200).json({profMaterias});
};

// post example
ctr.createP = () => async (req, res, next) => {
  const {nomina} = req.body;
  const profe = new Profesor({nomina});
  await profe.save();
  res.status(201).json({
    message: 'Prof created successfully',
    profe,
  });
};

module.exports = ctr;

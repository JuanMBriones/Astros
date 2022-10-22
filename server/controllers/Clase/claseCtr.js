const Clase = require('../../models/clase');
const Profesor = require('../../models/profesor');
const ctr = {};

// get all clases
ctr.getClases = () => async (req, res, next) => {
  const clases = await Clase.find().exec();
  res.status(200).json({clases});
};

// get profesores que pueden dar una clase
ctr.getProfesores = () => async (req, res, next) => {
  // expected: id clase
  const clase = req.query.clase;
  const claseCip = await Clase.find({id: clase}).distinct('cip').exec();
  const profesores = await Profesor.find({cip: {'$in': claseCip}}).exec();
  profesores.forEach((profesor) => {
    if (profesor.clases.includes(clase)) {
      profesor.asignada = 1;
    } else {
      profesor.asignada = 0;
    }
  });
  console.log(profesores);
  res.status(200).json({profesores});
};

module.exports = ctr;

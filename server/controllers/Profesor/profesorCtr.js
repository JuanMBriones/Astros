const   Profesor = require('../../models/profesor'),
        CustomError = require('../../middleware/customError'),
        ctr = {};

// get example
ctr.getAll = () => async (req, res, next) =>  {
    const allProfessors = await Profesor.find().limit(5).exec();
    res.status(200).json({allProfessors});
}

// post example
ctr.createP = () => async (req, res, next) => {
    let {nomina} = req.body;
    let profe = new Profesor({nomina});
    await profe.save();
    res.status(201).json({
        message: 'Prof created successfully',
        profe
    })
}

module.exports = ctr;
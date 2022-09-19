const mongoose = require("mongoose");

const claseSchema = new mongoose.Schema({
    paquete_clave: {
        type: String,
    },
    grupo_apg: {
        type: String,
    },
    materia: {
        type: String,
    },
    salon: {
        type: String,
    },
    aula: {
        type: String,
    },
    profesor: {
        type: mongoose.Schema.Types.ObjectId,
    },
    propuesta: {
        type: String,
    },
    carga: {
        type: Number,
    },
    semestre: {
        type: Number,
    },
    periodo: {
        type: String,
    },
    modalidad_grupo: {
        type: String,
    },
    horario: [{
        type: mongoose.Schema.Types.ObjectId,
    }]
});

module.exports = mongoose.model("clase", claseSchema, "clase");
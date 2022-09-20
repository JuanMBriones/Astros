const mongoose = require("mongoose");

const profesorSchema = new mongoose.Schema({
    depto_prof: {
        type: String,
    },
    entrada: {
        type: String,
    },
    nomina: {
        type: String,
    },
    nombre: {
        type: String,
    },
    correo: {
        type: String,
    },
    modalidad: {
        type: String,
    },
    rol: {
        type: String,
    },
    comentarios: {
        type: String,
    },
    ultima_mod: {
        type: Date,
    }
});

module.exports = mongoose.model("profesor", profesorSchema, "profesor");
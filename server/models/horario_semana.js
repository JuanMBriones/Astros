const mongoose = require("mongoose");

const hsSchema = new mongoose.Schema({
    hora_inicio: {
        type: Timestamp
    },
    hora_fin: {
        type: Timestamp
    },
    dia: {
        type: Number,
        min: 1,
        max: 7
    }
});

module.exports = mongoose.model("horario_semana", hsSchema);
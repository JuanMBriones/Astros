const mongoose = require('mongoose');

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
  cip: {
    type: Number,
  },
  modalidad: {
    type: String,
  },
  rol: {
    type: String,
  },
  carga_perm: {
    type: Number,
  },
  carga_asig: {
    type: Number,
  },
  clases: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  comentarios: {
    type: String,
  },
  // date or timestamp?
  ultima_mod: {
    type: Date,
  },
});

module.exports = mongoose.model('profesor', profesorSchema, 'profesor');

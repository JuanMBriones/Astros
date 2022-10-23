const mongoose = require('mongoose');

const claseSchema = new mongoose.Schema({
  paquete: {
    type: String,
  },
  clave: {
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
  cip: {
    type: Number,
  },
  // mejor array?
  profesor: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  // propuesta = modelo?
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
  // why array?
  horario: [{
    type: mongoose.Schema.Types.Mixed,
  }],
  asignada: {
    type: Number,
  },
});

module.exports = mongoose.model('clase', claseSchema, 'clase');

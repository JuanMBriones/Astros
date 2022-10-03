const mongoose = require('mongoose');

const hbSchema = new mongoose.Schema({
  bloque: {
    type: Number,
  },
  horario_semana: [{
    type: mongoose.Schema.Types.Mixed,
  }],
});

module.exports = mongoose.model('horario_bloque', hbSchema, 'horario_bloque');

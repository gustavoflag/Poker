'use strict';
var mongoose = require('mongoose');
var participanteSchema = require('./participante.js');

var Schema = mongoose.Schema;

var JogoSchema = new Schema({
  participantes: {
    type: [participanteSchema.Schema],
    required: true,
    unique: false
  },
  data: {
    type: Date,
    default: Date.now,
    required: 'Data é obrigatório!'
  },
  valorMaleta: {
    type: Number,
    default: 0
  },
  numero: {
    type: Number,
    default: 0
  },
  observacoes: {
    type: String,
    default: ''
  },
});

module.exports = mongoose.model('Jogo', JogoSchema);

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ParticipanteSchema = new Schema({
  nomeJogador: {
    type: String,
    required: 'Nome do jogador é obrigatório!',
    unique: false
  },
  lugar: {
    type: Number,
    required: 'Lugar (posição) do jogador é obrigatório!'
  },
  rebuy: {
    type: Boolean,
    default: false
  }
});

module.exports = {
    Schema: ParticipanteSchema,
    Participante: mongoose.model('Participante', ParticipanteSchema)
};

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
  pontos: {
    type: Number,
    default: 0
  },
  valorInvestido:{
    type: Number,
    default: 0
  },
  valorRecebido:{
    type: Number,
    default: 0
  },
  rebuy: {
    type: Number,
    default: 0
  },
  jogosCampeonato: {
    type: Number,
    default: 0
  },
  pontosCampeonato: {
    type: Number,
    default: 0
  },
  qtdVezesDealer: {
    type: Number,
    default: 0
  },
  dealer:{
    type: Boolean,
    default: false
  }
});

module.exports = {
    Schema: ParticipanteSchema,
    Participante: mongoose.model('Participante', ParticipanteSchema)
};

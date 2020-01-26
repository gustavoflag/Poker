'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PreJogoSchema = new Schema({
  participantes: {
    type: [{
      nomeJogador: {
        type: String,
        required: 'Nome do jogador é obrigatório!',
        unique: false
      },
      lugarNaMesa:{
        type: Number
      },
      eliminado:{
        type: Boolean
      },
      lugar: {
        type: Number
      },
      rebuy: {
        type: Number,
        default: 0
      },
      mesa: {
        type: Number
      },
      pago: {
        type: Boolean,
        default: false
      },
      qtdVezesDealer: {
        type: Number,
        default: 0
      },
      socio:{
        type: Boolean,
        default: false
      },
      dealer:{
        type: Boolean,
        default: false
      },
      timeChip:{
        type: Boolean,
        default: true
      }
    }],
    required: true,
    unique: false
  },
  data: {
    type: Date,
    default: Date.now,
    required: 'Data é obrigatório!'
  },
  qtdMesas: {
    type: Number
  },
  sorteado: {
    type: Boolean
  }
});

module.exports = mongoose.model('PreJogo', PreJogoSchema);

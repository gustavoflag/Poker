'use strict';
var mongoose = require('mongoose');
var localSchema = require('./local.js');
var Schema = mongoose.Schema;

var AgendamentoSchema = new Schema({
  data: {
    type: Date,
    required: 'Data é obrigatório!'
  },
  local: {
    type: localSchema.Schema
  },
  status: {
    type: String,
    enum: ['ativo', 'inativo', 'cancelado', 'terminado']
  },
  jogoId: {
    type: String
  },
  numeroJogo: {
    type: Number
  }
});

module.exports = mongoose.model('Agendamento', AgendamentoSchema);
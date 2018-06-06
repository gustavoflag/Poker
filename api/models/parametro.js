'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ParametroSchema = new Schema({
  valorBuyIn: {
    type: Number,
    required: 'Valor do BuyIn é obrigatório!'
  },
  valorMaleta: {
    type: Number,
    required: 'Valor da Maleta é obrigatório!'
  },
  participantesPremiacaoTerceiro: {
    type: Number
  },
  jogadoresRedraw: {
    type: Number
  }
});

module.exports = mongoose.model('Parametro', ParametroSchema);

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
  },
  premiacaoSegundo: {
    type: Number
  },
  premiacaoTerceiro: {
    type: Number
  },
  qtdFichasBuyIn: {
    type: Number
  },
  qtdFichasTimeChip: {
    type: Number
  },
  pontosExtraKO: {
    type: Number
  },
  valorTaxaLimpeza: {
    type: Number
  }, 
  valorCaixa: {
    type: Number
  }
});

module.exports = mongoose.model('Parametro', ParametroSchema);

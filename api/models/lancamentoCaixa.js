'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LancamentoCaixaSchema = new Schema({
  data: {
    type: Date,
    default: Date.now,
    required: 'Data é obrigatório!'
  },
  conta: {
    type: String,
    enum: ['premio', 'caixa', 'limpeza'],
    default: 'premio'
  },
  valor: {
    type: Number,
    default: 0
  },
  descricao: {
    type: String
  },
  idJogo: {
    type: String
  }
});

module.exports = mongoose.model('LancamentoCaixa', LancamentoCaixaSchema);

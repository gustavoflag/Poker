'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocalSchema = new Schema({
  nome: {
    type: String,
    required: 'Nome é obrigatório'
  },
  endereço: {
    type: String
  },
  padrao: {
    type: Boolean,
    default: false
  },
  online: {
    type: Boolean,
    default: false
  }
});

module.exports = {
  Schema: LocalSchema,
  Local: mongoose.model('Local', LocalSchema)
};

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PontuacaoSchema = new Schema({
  lugar:{
    type: Number,
    required: 'Lugar (colocação) é obrigatório!'
  },
  pontos:{
    type: Number,
    required: '"Pontos" é obrigatório!'
  },
});

module.exports = { 
  Schema: PontuacaoSchema,
  Pontuacao: mongoose.model('Pontuacao', PontuacaoSchema) 
};

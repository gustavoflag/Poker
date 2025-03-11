'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pontuacaoSchema = require('./pontuacao.js');

var TipoPontuacaoSchema = new Schema({
  nome:{
    type: String,
    unique: true,
    required: 'Nome é obrigatório!'
  },
  minJogadores:{
    type: Number,
    required: 'Mínimo de jogadores é obrigatório!'
  },
  maxJogadores:{
    type: Number,
    required: 'Máximo de jogadores é obrigatório!'
  },
  pontuacoes: {
    type: [pontuacaoSchema.Schema],
    required: 'Pontuações é obrigatório!'
  },
});

module.exports = mongoose.model('TipoPontuacao', TipoPontuacaoSchema);

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PontuacaoSchema = new Schema({
  lugar:{
    type: Number
  },
  pontos:{
    type: Number
  }
});

module.exports = mongoose.model('Pontuacao', PontuacaoSchema);

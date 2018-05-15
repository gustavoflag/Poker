'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PremiacaoSchema = new Schema({
  lugar:{
    type: Number,
    unique: true
  },
  descricao:{
    type: String
  },
  porcentual:{
    type: Number,
    required: '"Porcentual" é obrigatório!'
  },
  premio:{
    type: Number
  }
});

module.exports = mongoose.model('Premiacao', PremiacaoSchema);

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JogadorSchema = new Schema({
  nome: {
    type: String,
    required: 'Nome é obrigatório!',
    unique: true
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  rookie:{
    type: Boolean,
    default: false
  },
  jogos:{
    type: Number,
    default: 0
  },
  pontos:{
    type: Number,
    default: 0
  },
  valorInvestido:{
    type: Number,
    default: 0
  },
  valorRecebido:{
    type: Number,
    default: 0
  },
  historicoJogos:{
    type: [{
      lugar: {
        type: Number,
        required: 'Lugar (posição) é obrigatório!'
      },
      quantidade: {
        type: Number,
        default:0
      }
    }]
  }
});

module.exports = mongoose.model('Jogador', JogadorSchema);

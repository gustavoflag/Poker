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
  },
  titulos:{
    type: [{
      ano: {
        type: Number
      }
    }]
  },
  pontosPorJogo:{
    type: Number
  },
  mediaPosicao:{
    type: Number
  },
  vitorias:{
    type: []
  },
<<<<<<< HEAD
  qtdVitorias:{
    type: Number
  },
  qtdHUs:{
=======
  qtdHUs:{
    type: Number
  },
  qtdPontuacoes:{
    type: Number
  },
  posicaoRanking:{
    type: Number
  },
  posicaoVitorias:{
>>>>>>> 575c0500752f9e950048b8665723e469c5fc1025
    type: Number
  },
  posicaoHU:{
    type: Number
  },
  posicaoPontuacoes:{
    type: Number
  },
  posicaoPontosPorJogo:{
    type: Number
  },
  posicaoMediaPosicao:{
    type: Number
  },
  posicaoRanking:{
    type: Number
  },
  posicaoVitorias:{
    type: Number
  },
  posicaoHU:{
    type: Number
  },
  posicaoPontuacoes:{
    type: Number
  },
  posicaoPontosPorJogo:{
    type: Number
  },
  posicaoMediaPosicao:{
    type: Number
  }
});

module.exports = mongoose.model('Jogador', JogadorSchema);

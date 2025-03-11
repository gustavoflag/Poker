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
  pontuacaoEtapas:{
    type:[{
      etapa: { 
        type: Number
      },
      pontos: {
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
  qtdVitorias:{
    type: Number
  },
  qtdHUs:{
    type: Number
  },
  qtdPontuacoes:{
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
  socio:{
    type: Boolean,
    default: false
  },
  classificacao:{
    type: Number
  },
  qtdVezesDealer:{
    type:Number,
    default: 0
  },
  foto: {
    type: String
  },
  pontosExtra: {
    type:Number,
    default: 0
  }
});

module.exports = mongoose.model('Jogador', JogadorSchema);

var mongoose = require('mongoose');
var jogadorSchema = require('./models/jogador.js');
var jogoSchema = require('./models/jogo.js');
var pontuacaoSchema = require('./models/pontuacao.js');
var participanteSchema = require('./models/participante.js');

Jogador = mongoose.model('Jogador');
Pontuacao = mongoose.model('Pontuacao');
Jogo = mongoose.model('Jogo');
Participante = mongoose.model('Participante');

//var pontuacaoSchema = require('./models/pontuacao.js');
//var jogoSchema = require('./models/jogo.js');
//var Jogador = jogadorSchema.Jogador;

var jogador1 = new Jogador({
  nome: 'Flag',
  rookie: false,
  jogos: 10,
  pontos: 5
});

console.log(jogador1);

var pontuacao = new Pontuacao({
  lugar: 1,
  pontos: 10
});

//console.log(pontuacao);

var jogador2 = new Jogador({
  nome: 'Flag2',
  rookie: false,
  jogos: 12,
  pontos: 8
});

var participante1 = new Participante({
  nomeJogador: 'teste1',
  lugar:1,
  rebuy: true
});

var participante2 = new Participante({
  nomeJogador: 'teste2',
  lugar:2
});

var jogo = new Jogo({
  participantes: [participante2, participante1],
  data: '2017-10-25 00:00:00 GMT-0200'
});

console.log('Jogo: ', jogo.participantes.sort(function(obj1, obj2){ return obj1.lugar - obj2.lugar; }));

var sortBy = require('sort-by');
var mongoose = require('mongoose');
var randomItem = require('random-item');
var jogoController = require('./jogoController.js')
var PreJogo = mongoose.model('PreJogo');

function salvarPreJogo(res, preJogo, mensagem){
  preJogo.save()
    .then((preJogo) => {
      return res.json({ message: mensagem, obj: preJogo });
    })
    .catch((err) => {
      return res.status(440).json(err);
    });
};

exports.consultar = function(req, res){
  PreJogo.findOne({ })
    .then((preJogo) => {
      if (!preJogo){
        return res.status(440).json({ message: 'Pré jogo não encontrado' });
      }

      return res.json(preJogo);
    })
    .catch((err) => {
      return res.status(440).json(err);
    });
};

exports.inserir = function(req, res){
  var novoPreJogo = new PreJogo(req.body);

  salvarPreJogo(res, novoPreJogo, 'Pré-Jogo salvo');
};

exports.alterarJogador = function(req, res){
  PreJogo.findOne({ })
    .then((preJogo) => {
      if (!preJogo){
        return res.status(440).json({ message: 'Pré jogo não encontrado' });
      }

      var jogador = preJogo.participantes.filter((par) => par.nomeJogador === req.body.nomeJogador)[0];
      if (!jogador){
        return res.status(440).json({ message: 'Jogador não encontrado' });
      }

      if (req.body.eliminado){
        jogador.eliminado = req.body.eliminado;
      } else {
        jogador.eliminado = false;
      }

      if (req.body.lugar){
        jogador.lugar = req.body.lugar;
      } else {
        jogador.lugar = undefined;
      }

      if (req.body.rebuy) {
        jogador.rebuy = req.body.rebuy;
      } else {
        jogador.rebuy = 0;
      }

      salvarPreJogo(res, preJogo, 'Jogador alterado');
    })
    .catch((err) => {
      return res.status(440).json(err);
    });
};

exports.sortear = function(req, res){
  PreJogo.findOne({ })
    .then((preJogo) => {
      if (!preJogo){
        return res.status(440).json({ message: 'Pré-jogo não encontrado' });
      }

      var listaOrdenada = [];
      var length = preJogo.participantes.filter((par) => !par.eliminado).length;

      for(var i = 0; i < length; i++){
        var participante = randomItem(preJogo.participantes.filter((par) => !par.eliminado));

        participante.lugarNaMesa = i + 1;
        listaOrdenada.push(participante);

        var indexRemove = preJogo.participantes.indexOf(participante);
        preJogo.participantes.splice(indexRemove, 1);
      }

      preJogo.participantes = listaOrdenada.concat(preJogo.participantes.filter((par) => par.eliminado).sort(sortBy('lugar')));

      salvarPreJogo(res, preJogo, 'Sorteio realizado');
    })
    .catch((err) => {
      return res.status(440).json(err);
    });
};

exports.gerarJogo = function(req, res){
  PreJogo.findOne({ })
    .then((preJogo) => {
      if (!preJogo){
        return res.status(440).json({ message: 'Pré-jogo não encontrado' });
      }

      req.body.participantes = preJogo.participantes;
      req.body.data = preJogo.data;

      PreJogo.remove({ _id: preJogo._id })
        .then((exclusao) => {
          return jogoController.inserir(req, res);
        })
        .catch((err) => {
          return res.status(440).json(err);
        });
    })
    .catch((err) => {
      return res.status(440).json(err);
    });
};

exports.excluir = function(req, res) {
  PreJogo.findOne({ })
    .then((preJogo) => {
      if (!preJogo){
        return res.status(440).json({ message: 'Pré-jogo não encontrado' });
      }

      PreJogo.remove({ _id: preJogo._id })
        .then((exclusao) => {
          return res.json({ message: 'Pré-jogo cancelado' });
        })
        .catch((err) => {
          return res.status(440).json(err);
        });
    })
    .catch((err) => {
      return res.status(440).json(err);
    });
};

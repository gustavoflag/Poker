var sortBy = require('sort-by');
var mongoose = require('mongoose'),
Jogador = mongoose.model('Jogador');

exports.listar = function(req, res) {
  Jogador.find({}, function(err, jogadores) {
    if (err)
      return res.status(440).json(err);
    return res.json(jogadores.sort(sortBy('nome')));
  });
};

exports.classificacao = function(req, res) {
  Jogador.find({}, function(err, jogadores) {
    if (err)
      return res.status(440).json(err);
    return res.json(jogadores.sort(sortBy('-pontos')));
  });
};

exports.inserir = function(req, res) {
  var novoJogador = new Jogador(req.body);
  novoJogador.save(function(err, task) {
    if (err)
      return res.status(440).json(err);
    return res.json(task);
  });
};

exports.consultar = function(req, res) {
  Jogador.findById(req.params.jogadorId, function(err, task) {
    if (err)
      return res.status(440).json(err);
    return res.json(task);
  });
};

exports.alterar = function(req, res) {
  Jogador.findOneAndUpdate({_id: req.params.jogadorId}, req.body, {new: true}, function(err, task) {
    if (err)
      return res.status(440).json(err);
    return res.json(task);
  });
};

exports.excluir = function(req, res) {
  Jogador.remove({
    _id: req.params.jogadorId
  }, function(err, task) {
    if (err)
      return res.status(440).json(err);
    return res.json({ message: 'Jogador excluído' });
  });
};

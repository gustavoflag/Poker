var mongoose = require('mongoose'),
Jogador = mongoose.model('Jogador');

exports.listar = function(req, res) {
  Jogador.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.inserir = function(req, res) {
  var novoJogador = new Jogador(req.body);
  novoJogador.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.consultar = function(req, res) {
  Jogador.findById(req.params.jogadorId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.alterar = function(req, res) {
  Jogador.findOneAndUpdate({_id: req.params.jogadorId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.excluir = function(req, res) {
  Jogador.remove({
    _id: req.params.jogadorId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Jogador excluído' });
  });
};

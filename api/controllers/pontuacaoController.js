var mongoose = require('mongoose'),
Pontuacao = mongoose.model('Pontuacao');

exports.listar = function(req, res) {
  Pontuacao.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.inserir = function(req, res) {
  var novaPontuacao = new Pontuacao(req.body);
  novaPontuacao.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.consultar = function(req, res) {
  Pontuacao.findById(req.params.pontuacaoId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.alterar = function(req, res) {
  Pontuacao.findOneAndUpdate({_id: req.params.pontuacaoId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.excluir = function(req, res) {
  Task.remove({
    _id: req.params.pontuacaoId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Pontuação excluída' });
  });
};

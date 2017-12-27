var sortBy = require('sort-by');
var mongoose = require('mongoose'),
Pontuacao = mongoose.model('Pontuacao');

exports.listar = function(req, res) {
  Pontuacao.find({}, function(err, pontuacoes) {
    if (err)
      return res.status(440).json(err);
    return res.json(pontuacoes.sort(sortBy('lugar')));
  });
};

exports.inserir = function(req, res) {
  var novaPontuacao = new Pontuacao(req.body);
  novaPontuacao.save(function(err, pontuacao) {
    if (err)
      return res.status(440).json(err);
    return res.json(pontuacao);
  });
};

exports.consultar = function(req, res) {
  Pontuacao.findById(req.params.pontuacaoId, function(err, pontuacao) {
    if (err)
      return res.status(440).json(err);
    return res.json(pontuacao);
  });
};

exports.alterar = function(req, res) {
  Pontuacao.findOneAndUpdate({_id: req.params.pontuacaoId}, req.body, {new: true}, function(err, pontuacao) {
    if (err)
      return res.status(440).json(err);
    return res.json(pontuacao);
  });
};

exports.excluir = function(req, res) {
  Pontuacao.remove({
    _id: req.params.pontuacaoId
  }, function(err, task) {
    if (err)
      return res.status(440).json(err);
    return res.json({ message: 'Pontuação excluída' });
  });
};

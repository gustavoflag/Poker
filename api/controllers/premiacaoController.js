var sortBy = require('sort-by');
var mongoose = require('mongoose'),
Premiacao = mongoose.model('Premiacao');

exports.listar = function(req, res) {
  Premiacao.find({}, function(err, premiacoes) {
    if (err)
      return res.status(440).json(err);
    return res.json(premiacoes.sort(sortBy('lugar')));
  });
};

exports.inserir = function(req, res) {
  var novaPremiacao = new Premiacao(req.body);
  novaPremiacao.save(function(err, premiacao) {
    if (err)
      return res.status(440).json(err);
    return res.json(premiacao);
  });
};

exports.consultar = function(req, res) {
  Premiacao.findById(req.params.premiacaoId, function(err, premiacao) {
    if (err)
      return res.status(440).json(err);
    return res.json(premiacao);
  });
};

exports.alterar = function(req, res) {
  Premiacao.findOneAndUpdate({_id: req.params.premiacaoId}, req.body, {new: true}, function(err, premiacao) {
    if (err)
      return res.status(440).json(err);
    return res.json(premiacao);
  });
};

exports.excluir = function(req, res) {
  Premiacao.remove({
    _id: req.params.premiacaoId
  }, function(err, task) {
    if (err)
      return res.status(440).json(err);
    return res.json({ message: 'Premiação excluída' });
  });
};

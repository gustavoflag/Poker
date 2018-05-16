var sortBy = require('sort-by');
var mongoose = require('mongoose'),
LancamentoCaixa = mongoose.model('LancamentoCaixa');

exports.listar = function(req, res) {
  LancamentoCaixa.find({}, function(err, lancamentos) {
    if (err)
      return res.status(440).json(err);
    return res.json(lancamentos.sort(sortBy('-data')));
  });
};

exports.inserir = function(req, res) {
  var novoLancamento = new LancamentoCaixa(req.body);
  novoLancamento.save(function(err, lancamento) {
    if (err)
      return res.status(440).json(err);
    return res.json(lancamento);
  });
};

exports.consultar = function(req, res) {
  LancamentoCaixa.findById(req.params.lancamentoCaixaId, function(err, lancamento) {
    if (err)
      return res.status(440).json(err);
    return res.json(lancamento);
  });
};

exports.alterar = function(req, res) {
  LancamentoCaixa.findOneAndUpdate({_id: req.params.lancamentoCaixaId}, req.body, {new: true}, function(err, lancamento) {
    if (err)
      return res.status(440).json(err);
    return res.json(lancamento);
  });
};

exports.excluir = function(req, res) {
  LancamentoCaixa.remove({
    _id: req.params.lancamentoCaixaId
  }, function(err, task) {
    if (err)
      return res.status(440).json(err);
    return res.json({ message: 'Lançamento excluído' });
  });
};

exports.saldo = function(req, res) {
  LancamentoCaixa.find({}, function(err, lancamentos) {
    var saldo = 0;

    lancamentos.forEach(function (lancamento){
      saldo += lancamento.valor;
    });

    return res.json(saldo);
  });
};

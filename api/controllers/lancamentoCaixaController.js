var sortBy = require('sort-by');
var mongoose = require('mongoose'),
LancamentoCaixa = mongoose.model('LancamentoCaixa');

exports.listar = async function(req, res) {
  try {
    const lancamentos = await LancamentoCaixa.find({});
    return res.json(lancamentos.sort(sortBy('-data')));
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.inserir = async function(req, res) {
  var novoLancamento = new LancamentoCaixa(req.body);
  try {
    const lancamento = await novoLancamento.save();
    return res.json(lancamento);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.consultar = async function(req, res) {
  try {
    const lancamento = await LancamentoCaixa.findById(req.params.lancamentoCaixaId);
    return res.json(lancamento);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.alterar = async function(req, res) {
  try {
    const lancamento = await LancamentoCaixa.findOneAndUpdate({_id: req.params.lancamentoCaixaId}, req.body, {new: true});
    return res.json(lancamento);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.excluir = async function(req, res) {
  try {
    const lancamento = await LancamentoCaixa.remove({
      _id: req.params.lancamentoCaixaId
    });

    return res.json({ message: 'Lançamento excluído' });
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.saldo = async function(req, res) {
  try {
    const lancamentos = await LancamentoCaixa.find({});
    var saldo = 0;

    lancamentos.forEach(function (lancamento){
      saldo += lancamento.valor;
    });

    return res.json(saldo);
  } catch (err) {
    return res.status(440).json(err);
  }
};
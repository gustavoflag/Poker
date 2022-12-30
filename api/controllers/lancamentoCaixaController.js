const sortBy = require('sort-by');
const mongoose = require('mongoose');
const LancamentoCaixa = mongoose.model('LancamentoCaixa');

exports.listar = async (req, res) => {
  try {
    const lancamentos = await LancamentoCaixa.find({});
    return res.json(lancamentos.sort(sortBy('-data')));
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.inserir = async (req, res) => {
  try {
    var novoLancamento = new LancamentoCaixa(req.body);
    const lancamento = await novoLancamento.save();
    return res.json(lancamento);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.consultar = async (req, res) => {
  try {
    const lancamento = await LancamentoCaixa.findById(req.params.lancamentoCaixaId);
    return res.json(lancamento);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.alterar = async (req, res) => {
  try {
    const lancamento = await LancamentoCaixa.findOneAndUpdate({_id: req.params.lancamentoCaixaId}, req.body, {new: true});
    return res.json(lancamento);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.excluir = async (req, res) => {
  try {
    const lancamento = await LancamentoCaixa.remove({
      _id: req.params.lancamentoCaixaId
    });

    return res.json({ message: 'Lançamento excluído' });
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.saldo = async (req, res) => {
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
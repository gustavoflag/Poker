const mongoose = require('mongoose');
const TipoPontuacao = mongoose.model('TipoPontuacao');

const sortTipoPontuacao = (a, b) => {
  return a.minJogadores - b.minJogadores;
}

exports.listar = async (req, res) => {
  try {
    const tiposPontuacao = await TipoPontuacao.find({});
    return res.json(tiposPontuacao.sort(sortTipoPontuacao));
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.inserir = async (req, res) => {
  try {
    var novoTipoPontuacao = new TipoPontuacao(req.body);
    const tipoPontuacao = await novoTipoPontuacao.save();
    return res.json(tipoPontuacao);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.inserirLote = async (req, res) => {
  var tiposPontuacao = req.body;

  var count = 0;
  tiposPontuacao.forEach((tipoPontuacaoBody) => {
    var novoTipoPontuacao = new TipoPontuacao(tipoPontuacaoBody);

    novoTipoPontuacao.save(function(err, task) {
      if (err)
        return res.status(440).json(err);
    });

    count++;
    if (count === tiposPontuacao.length){
      return res.json(tiposPontuacao);
    }
  });
};

exports.consultar = async (req, res) => {
  try {
    const tipoPontuacao = await TipoPontuacao.findById(req.params.tipoPontuacaoId);
    return res.json(tipoPontuacao);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.alterar = async (req, res) => {
  try {
    const tipoPontuacao = await TipoPontuacao.findOneAndUpdate({_id: req.params.tipoPontuacaoId}, req.body, {new: true});
    return res.json(tipoPontuacao);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.excluir = async (req, res) => {
  try {
    await TipoPontuacao.remove({
      _id: req.params.tipoPontuacaoId
    });

    return res.json({ message: 'Tipo Pontuação excluída' });
  } catch (err) {
    return res.status(440).json(err);
  }
};

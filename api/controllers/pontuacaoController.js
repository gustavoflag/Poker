const sortBy = require('sort-by');
const mongoose = require('mongoose');
const Pontuacao = mongoose.model('Pontuacao');

exports.listar = async (req, res) => {
  try {
    const pontuacoes = await Pontuacao.find({});
    return res.json(pontuacoes.sort(sortBy('lugar')));
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.inserir = async (req, res) => {
  try {
    var novaPontuacao = new Pontuacao(req.body);
    const pontuacao = await novaPontuacao.save();
    return res.json(pontuacao);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.inserirLote = async (req, res) => {
  var pontuacoes = req.body;

  var count = 0;
  pontuacoes.forEach((pontuacaoBody) => {
    var novaPontuacao = new Pontuacao(pontuacaoBody);

    novaPontuacao.save(function(err, task) {
      if (err)
        return res.status(440).json(err);
    });

    count++;
    if (count === pontuacoes.length){
      return res.json(pontuacoes);
    }
  });
};

exports.consultar = async (req, res) => {
  try {
    const pontuacao = await Pontuacao.findById(req.params.pontuacaoId);
    return res.json(pontuacao);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.alterar = async (req, res) => {
  try {
    const pontuacao = await Pontuacao.findOneAndUpdate({_id: req.params.pontuacaoId}, req.body, {new: true});
    return res.json(pontuacao);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.excluir = async (req, res) => {
  try {
    await Pontuacao.remove({
      _id: req.params.pontuacaoId
    });

    return res.json({ message: 'Pontuação excluída' });
  } catch (err) {
    return res.status(440).json(err);
  }
};

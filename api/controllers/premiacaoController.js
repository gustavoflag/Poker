const sortBy = require('sort-by');
const mongoose = require('mongoose');
const Premiacao = mongoose.model('Premiacao');

exports.listar = async (req, res) => {
  try {
    const premiacoes = await Premiacao.find({});

    return res.json(premiacoes.sort(sortBy('lugar')));
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.inserir = async (req, res) => {
  try {
    var novaPremiacao = new Premiacao(req.body);
    await novaPremiacao.save();

    return res.json(premiacao);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.inserirLote = async (req, res) => {
  try {
    var premiacoes = req.body;

    var count = 0;
    premiacoes.forEach(async (pontuacaoBody) => {
      var novaPremiacao = new Premiacao(pontuacaoBody);

      await novaPremiacao.save();

      count++;
      if (count === premiacoes.length) {
        return res.json(premiacoes);
      }
    });
  } catch (err) {
    return res.status(440).json(err);
  }
};


exports.consultar = async (req, res) => {
  try {
    const premiacao = await Premiacao.findById(req.params.premiacaoId);

    return res.json(premiacao);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.alterar = async (req, res) => {
  try {
    const premiacao = await Premiacao.findOneAndUpdate({ _id: req.params.premiacaoId }, req.body, { new: true });

    return res.json(premiacao);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.excluir = async (req, res) => {
  try {
    Premiacao.remove({
      _id: req.params.premiacaoId
    });

    return res.json({ message: 'Premiação excluída' });
  } catch (err) {
    return res.status(440).json(err);
  }
};

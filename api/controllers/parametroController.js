const mongoose = require('mongoose');
const Parametro = mongoose.model('Parametro');

exports.consultar = async (req, res) => {
  try {
    const parametro = await Parametro.findOne({ });
    return res.json(parametro);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.alterar = async (req, res) => {
  try {
    var parametro = await Parametro.findOne({ });

    if (parametro){
      parametro = await Parametro.findOneAndUpdate({ }, req.body, {new: true});
      return res.json(parametro);
    } else {
      var novoParametro = new Parametro(req.body);
      await novoParametro.save();
      return res.json(novoParametro);
    }
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.tema = (req, res) => {
  return res.json(process.env.THEME || 'slate');
};

const sortBy = require('sort-by');
const mongoose = require('mongoose');
const Local = mongoose.model('Local');

exports.listar = async (req, res) => {
  try {
    const locais = await Local.find({});
    return res.json(locais);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.inserir = async (req, res) => {
  try {
    if (req.body.padrao === true){
      await Local.updateMany({}, { padrao: false });
    }

    var novoLocal = new Local(req.body);
    const local = await novoLocal.save();
    return res.json(local);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.inserirLote = async (req, res) => {
  var locais = req.body;

  var count = 0;
  locais.forEach((localBody) => {
    var novoLocal = new Local(localBody);

    novoLocal.save(function(err, local) {
      if (err)
        return res.status(440).json(err);
    });

    count++;
    if (count === locais.length){
      return res.json(locais);
    }
  });
};

exports.consultar = async (req, res) => {
  try {
    const local = await Local.findById(req.params.localId);
    return res.json(local);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.alterar = async (req, res) => {
  try {
    if (req.body.padrao === true){
      await Local.updateMany({}, { padrao: false });
    }

    const local = await Local.findOneAndUpdate({_id: req.params.localId}, req.body, { new: true });
    return res.json(local);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.excluir = async (req, res) => {
  try {
    await Local.remove({
      _id: req.params.localId
    });

    return res.json({ message: 'Local excluído' });
  } catch (err) {
    return res.status(440).json(err);
  }
};

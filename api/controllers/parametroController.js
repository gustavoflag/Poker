var mongoose = require('mongoose'),
Parametro = mongoose.model('Parametro');

exports.consultar = function(req, res) {
  Parametro.findOne({ }, function(err, parametro) {
    if (err)
      return res.status(440).json(err);
    return res.json(parametro);
  });
};

exports.alterar = function(req, res) {
  Parametro.findOne({ }, function(err, parametro) {
    if (parametro){
      Parametro.findOneAndUpdate({ }, req.body, {new: true}, function(err, parametro) {
        if (err)
          return res.status(440).json(err);
        return res.json(parametro);
      });
    } else {
      var novoParametro = new Parametro(req.body);
      novoParametro.save(function(err, parametro) {
        if (err)
          return res.status(440).json(err);
        return res.json(parametro);
      });
    }
  });
};

exports.tema = function(req, res) {
  return res.json(process.env.THEME || 'slate');
};

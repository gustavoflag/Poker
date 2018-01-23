var sortBy = require('sort-by');
var mongoose = require('mongoose'),
Jogador = mongoose.model('Jogador');

exports.listar = function(req, res) {
  Jogador.find({}, function(err, jogadores) {
    if (err)
      return res.status(440).json(err);
    return res.json(jogadores.sort(sortBy('nome')));
  });
};

exports.classificacao = function(req, res) {
  Jogador.find({}, function(err, jogadores) {
    if (err)
      return res.status(440).json(err);
    return res.json(jogadores.sort(sortBy('-pontos'
                                         ,'historicoJogos[1].quantidade'
                                         ,'historicoJogos[2].quantidade'
                                         ,'historicoJogos[3].quantidade'
                                         ,'historicoJogos[4].quantidade'
                                         ,'historicoJogos[5].quantidade'
                                         ,'historicoJogos[6].quantidade'
                                         ,'historicoJogos[7].quantidade'
                                         ,'historicoJogos[8].quantidade'
                                         ,'historicoJogos[9].quantidade'
                                         ,'historicoJogos[10].quantidade'
                                         ,'quantidade')));
  });
};

exports.classificacaoRookies = function(req, res) {
  Jogador.find({}, function(err, jogadores) {
    if (err)
      return res.status(440).json(err);
    return res.json(jogadores.filter((j) => j.rookie === true).sort(sortBy('-pontos'
                                                                          ,'historicoJogos[1].quantidade'
                                                                          ,'historicoJogos[2].quantidade'
                                                                          ,'historicoJogos[3].quantidade'
                                                                          ,'historicoJogos[4].quantidade'
                                                                          ,'historicoJogos[5].quantidade'
                                                                          ,'historicoJogos[6].quantidade'
                                                                          ,'historicoJogos[7].quantidade'
                                                                          ,'historicoJogos[8].quantidade'
                                                                          ,'historicoJogos[9].quantidade'
                                                                          ,'historicoJogos[10].quantidade'
                                                                          ,'quantidade')));
  });
};

exports.inserir = function(req, res) {
  var novoJogador = new Jogador(req.body);

  novoJogador.historicoJogos = [];
  novoJogador.historicoJogos.push({ lugar:-1, quantidade:0 });

  for (var i = 1; i <= 15; i++){
    novoJogador.historicoJogos.push({ lugar:i, quantidade:0 });
  }

  novoJogador.save(function(err, task) {
    if (err)
      return res.status(440).json(err);
    return res.json(task);
  });
};

exports.consultar = function(req, res) {
  Jogador.findById(req.params.jogadorId, function(err, task) {
    if (err)
      return res.status(440).json(err);
    return res.json(task);
  });
};

exports.alterar = function(req, res) {
  Jogador.findOneAndUpdate({_id: req.params.jogadorId}, req.body, {new: true}, function(err, task) {
    if (err)
      return res.status(440).json(err);
    return res.json(task);
  });
};

exports.excluir = function(req, res) {
  Jogador.remove({
    _id: req.params.jogadorId
  }, function(err, task) {
    if (err)
      return res.status(440).json(err);
    return res.json({ message: 'Jogador excluído' });
  });
};

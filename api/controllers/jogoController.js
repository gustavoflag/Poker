var mongoose = require('mongoose'),
Jogo = mongoose.model('Jogo'),
Jogador = mongoose.model('Jogador'),
Pontuacao = mongoose.model('Pontuacao');

exports.listar = function(req, res) {
  Jogo.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.inserir = function(req, res) {
  var novoJogo = new Jogo(req.body);

  for (var i = 0; i < novoJogo.participantes.length; i++){
      var participante = novoJogo.participantes[i];

      var jogadorParticipante = Jogador.find((Jogador) => Jogador.nome === participante.nomeJogador);

      var pontuacaoParticipante = Pontuacao.find((Pontuacao) => Pontuacao.lugar === participante.lugar);

      jogadorParticipante.pontos += pontuacaoParticipante.pontos;

      Jogador.findOneAndUpdate({_id: jogadorParticipante._id}, jogadorParticipante, {new: false}, function(err, task) {
        if (err)
          res.send(err);
        res.json(task);
      });
  }

  novoJogo.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.consultar = function(req, res) {
  Jogo.findById(req.params.jogoId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.alterar = function(req, res) {
  Jogo.findOneAndUpdate({_id: req.params.jogoId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.excluir = function(req, res) {
  Jogo.remove({
    _id: req.params.jogoId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Jogo excluído' });
  });
};

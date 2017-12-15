var mongoose = require('mongoose'),
Jogo = mongoose.model('Jogo'),
Jogador = mongoose.model('Jogador'),
Pontuacao = mongoose.model('Pontuacao');
//Participante = mongoose.model('Participante');

exports.listar = function(req, res) {
  Jogo.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.inserir = function(req, res) {
  var novoJogo = new Jogo(req.body);

  novoJogo.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });

  novoJogo.participantes.forEach(function (participante){
    Pontuacao.findOne({ lugar: participante.lugar }, function(err, pontuacaoParticipante) {
      if (err)
        res.send(err);

      if (pontuacaoParticipante){
        Jogador.findOne({ nome: participante.nomeJogador }, function(err, jogadorParticipante) {
          if (err)
            res.send(err);

          if (!jogadorParticipante){
            var novoJogador = new Jogador({ nome: participante.nomeJogador });
            novoJogador.save(function(err, jog) {
              if (err)
                res.send(err);

              jogadorParticipante = jog;

              jogadorParticipante.pontos += pontuacaoParticipante.pontos;
              jogadorParticipante.jogos++;

              jogadorParticipante.save(function(err, task) {
                  if (err)
                    res.send(err);
              });
            });
          }
          else {
            jogadorParticipante.pontos += pontuacaoParticipante.pontos;
            jogadorParticipante.jogos++;

            jogadorParticipante.save(function(err, task) {
                if (err)
                  res.send(err);
            });
          }
        });
      }
    });
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
  Jogo.findById(req.params.jogoId, function(err, jogo) {
    if (err)
      res.send(err);

    jogo.participantes.forEach(function (participante){
      Jogador.findOne({ nome: participante.nomeJogador }, function(err, jogadorParticipante) {
        if (err)
          res.send(err);

        if (jogadorParticipante){
          Pontuacao.findOne({ lugar: participante.lugar }, function(err, pontuacaoParticipante) {
            if (err)
              res.send(err);

            if (pontuacaoParticipante){
              jogadorParticipante.pontos -= pontuacaoParticipante.pontos;
              jogadorParticipante.jogos--;

              jogadorParticipante.save(function(err, task) {
                  if (err)
                    res.send(err);
              });
            }
          });
        }
      });
    });
  });

  Jogo.remove({
    _id: req.params.jogoId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Jogo excluído' });
  });
};

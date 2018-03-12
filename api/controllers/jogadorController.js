var sortBy = require('sort-by');
var mongoose = require('mongoose'),
Jogador = mongoose.model('Jogador'),
Jogo = mongoose.model('Jogo');

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
    return res.json(jogadores.sort(compararJogadores));
  });
};

exports.classificacaoRookies = function(req, res) {
  Jogador.find({}, function(err, jogadores) {
    if (err)
      return res.status(440).json(err);
    return res.json(jogadores.filter((j) => j.rookie === true).sort(compararJogadores));
  });
};

/*exports.classificacaoMes = function(req, res){
  var dateNow = new Date();
  var jogadores = [];

  Jogo.find({ data: {"$gte": new Date(dateNow.getYear(), dateNow.getMonth() - 1, 1), "$lt": new Date(dateNow.getYear(), dateNow.getMonth(), 1) }}, function(err, jogos) {*/
  //Jogo.find({ data: {"$gte": new Date(2018, 0, 1), "$lt": new Date(2018, 1, 1) }}, function(err, jogos) {
  /*  if (err)
      return res.status(440).json(err);

    jogos.forEach(function (jogo){
      jogo.participantes.forEach(function (participante){

        var jogador = null;
        for (var i = 0; i < jogadores.length; i++){
          if (jogadores[i].nomeJogador === participante.nomeJogador){
            jogador = jogadores[i];
            break;
          }
        }
        if (!jogador){
          var novoJogador = {
            nomeJogador: participante.nomeJogador,
            pontos: participante.pontos
          };

          jogadores.push(novoJogador);
        } else {
          jogador.pontos += participante.pontos;
        }
      });
    });

    return res.json(jogadores.sort(compararPontos));
  });
};

function compararPontos(a, b){
  var diffPontos = (a.pontos - b.pontos);
  if (diffPontos != 0){
    return diffPontos * -1;
  }
}*/

function compararJogadores(a, b){
  var diffPontos = (a.pontos - b.pontos);
  if (diffPontos != 0){
    return diffPontos * -1;
  }

  for (var i = 1; i <= 15; i++){
    var diffPos = (a.historicoJogos[i].quantidade - b.historicoJogos[i].quantidade);

    if (diffPos != 0){
      return diffPos * -1;
    }
  }

  var diffValor = (a.valorRecebido - b.valorRecebido);
  if (diffValor != 0){
    return diffValor * -1;
  }

  var diffJogos = (a.jogos - b.jogos);
  if (diffJogos != 0){
    return diffJogos;
  }
}

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

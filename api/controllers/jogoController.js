var sortBy = require('sort-by');
var mongoose = require('mongoose'),
Jogo = mongoose.model('Jogo'),
Jogador = mongoose.model('Jogador'),
Pontuacao = mongoose.model('Pontuacao'),
Parametro = mongoose.model('Parametro');

exports.listar = function(req, res) {
  Jogo.find({}, function(err, jogos) {
    if (err)
      return res.status(440).json(err);

    jogos.forEach(function (jogo){
      if(jogo.participantes){
        jogo.participantes = jogo.participantes.sort(sortBy('lugar'));
      }
    });

    return res.json(jogos.sort(sortBy('-data')));
  });
};

exports.inserir = function(req, res) {
  var novoJogo = new Jogo(req.body);

  Pontuacao.find({}, function(err, pontuacoes) {

    if (!pontuacoes)
      return res.status(440).json({ errmsg: "Pontuações não encontradas" });

    Parametro.findOne({ }, function(err, parametro) {
      if (!parametro)
        return res.status(440).json({ errmsg: "Parâmetros não encontrados" });

      var premiacaoPrimeiro = 0;
      var premiacaoSegundo = 0;
      var premiacaoTerceiro = 0;

      var qtdeRebuy = novoJogo.participantes.filter((p) => p.rebuy === true).length;

      var premiacaoTotal = (novoJogo.participantes.length * parametro.valorBuyIn)
                            + (qtdeRebuy * parametro.valorBuyIn);

      if (!parametro.participantesPremiacaoTerceiro){
        parametro.participantesPremiacaoTerceiro = 9999;
      }

      if (novoJogo.participantes.length >= parametro.participantesPremiacaoTerceiro){
        premiacaoTerceiro = parametro.valorBuyIn;
        premiacaoSegundo = parametro.valorBuyIn * 2;
      } else {
        premiacaoSegundo = parametro.valorBuyIn;
      }

      premiacaoPrimeiro = premiacaoTotal - premiacaoSegundo - premiacaoTerceiro;

      novoJogo.valorMaleta = novoJogo.participantes.length * parametro.valorMaleta;

      var count = 0;

      novoJogo.participantes.forEach(function (participante){
        participante.valorInvestido = parametro.valorBuyIn + parametro.valorMaleta;

        if(!participante.rebuy){
          var pontuacao = pontuacoes.find(function(element, index, array) { return element.lugar === participante.lugar });

          if (pontuacao){
            participante.pontos = pontuacao.pontos;
          }
        } else {
          participante.valorInvestido += parametro.valorBuyIn;
        }

        if (participante.lugar === 1){
          participante.valorRecebido = premiacaoPrimeiro;
        } else if (participante.lugar === 2) {
          participante.valorRecebido = premiacaoSegundo;
        } else if (participante.lugar === 3) {
          participante.valorRecebido = premiacaoTerceiro;
        }

        Jogador.findOne({ nome: participante.nomeJogador }, function(err, jogadorParticipante) {
          if (err)
            return res.status(440).json(err);

          if (jogadorParticipante){

            jogadorParticipante.pontos += participante.pontos;
            jogadorParticipante.valorRecebido += participante.valorRecebido;
            jogadorParticipante.valorInvestido += participante.valorInvestido;
            jogadorParticipante.jogos++;

            var historicoPosicao;

            if (participante.rebuy){
              historicoPosicao = jogadorParticipante.historicoJogos.find(function(element, index, array) { return element.lugar === -1 });
            } else {
              historicoPosicao = jogadorParticipante.historicoJogos.find(function(element, index, array) { return element.lugar === participante.lugar });
            }

            if (!historicoPosicao){
              jogadorParticipante.historicoJogos.concat({ lugar:participante.lugar, quantidade:1 });
            } else {
              historicoPosicao.quantidade++;
            }

            jogadorParticipante.save(function(err, task) {
                if (err){
                  return res.status(440).json(err);
                }
            });
          } else {
            var novoJogador = new Jogador({ nome: participante.nomeJogador });
            novoJogador.save(function(err, jog) {
              if (err)
                return res.status(440).json(err);

              jogadorParticipante = jog;

              jogadorParticipante.pontos += participante.pontos;
              jogadorParticipante.valorRecebido += participante.valorRecebido;
              jogadorParticipante.valorInvestido += participante.valorInvestido;
              jogadorParticipante.jogos++;

              var historicoPosicao;

              if (participante.rebuy){
                historicoPosicao = jogadorParticipante.historicoJogos.find(function(element, index, array) { return element.lugar === -1 });
              } else {
                historicoPosicao = jogadorParticipante.historicoJogos.find(function(element, index, array) { return element.lugar === participante.lugar });
              }

              if (!historicoPosicao){
                jogadorParticipante.historicoJogos.concat({ lugar:participante.lugar, quantidade:1 });
              } else {
                historicoPosicao.quantidade++;
              }

              jogadorParticipante.save(function(err, jog) {
                  if (err)
                    return res.status(440).json(err);
              });
            });
          }

          count++;
          if (count === novoJogo.participantes.length){
            novoJogo.save(function(err, jogo) {
              if (err)
                return res.status(440).json(err);
              return res.json(jogo);
            });
          }
        });
      });
    });
  });
};

exports.consultar = function(req, res) {
  Jogo.findById(req.params.jogoId, function(err, jogo) {
    if (err)
      return res.status(440).json(err);
    return res.json(jogo);
  });
};

exports.alterar = function(req, res) {
  this.excluir(req, res);

  return this.incluir(req, res);
  /*Jogo.findOneAndUpdate({_id: req.params.jogoId}, req.body, {new: true}, function(err, jogo) {
    if (err)
      return res.status(440).json(err);
    return res.json(jogo);
  });*/
};

exports.excluir = function(req, res) {
  Jogo.findById(req.params.jogoId, function(err, jogo) {
    if (err)
      res.status(440).json(err);

    jogo.participantes.forEach(function (participante){
      Jogador.findOne({ nome: participante.nomeJogador }, function(err, jogadorParticipante) {
        if (err)
          res.status(440).json(err);

        if (jogadorParticipante){
          Pontuacao.findOne({ lugar: participante.lugar }, function(err, pontuacaoParticipante) {
            if (err)
              res.status(440).json(err);

            jogadorParticipante.pontos -= participante.pontos;
            jogadorParticipante.valorInvestido -= participante.valorInvestido;
            jogadorParticipante.valorRecebido -= participante.valorRecebido;
            jogadorParticipante.jogos--;

            var historicoPosicao;

            if (participante.rebuy){
              historicoPosicao = jogadorParticipante.historicoJogos.find(function(element, index, array) { return element.lugar === -1 });
            } else {
              historicoPosicao = jogadorParticipante.historicoJogos.find(function(element, index, array) { return element.lugar === participante.lugar });
            }

            if (!historicoPosicao){
              historicoPosicao.quantidade--;
            }

            jogadorParticipante.save(function(err, task) {
                if (err)
                  res.status(440).json(err);
            });
          });
        }
      });
    });

    Jogo.remove({
      _id: jogo._id
    }, function(err, jogo) {
      if (err)
        return res.status(440).json(err);
      return res.json({ message: 'Jogo excluído' });
    });
  });
};

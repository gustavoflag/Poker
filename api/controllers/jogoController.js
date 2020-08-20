var sortBy = require('sort-by');
var mongoose = require('mongoose'),
Jogo = mongoose.model('Jogo'),
Jogador = mongoose.model('Jogador'),
Pontuacao = mongoose.model('Pontuacao'),
Parametro = mongoose.model('Parametro'),
LancamentoCaixa = mongoose.model('LancamentoCaixa');

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

exports.quantidade = function(req, res){
  Jogo.find({}, function(err, jogos) {
    if (err)
      return res.status(440).json(err);

    return res.json(jogos.length);
  });
};

exports.inserir = function(req, res) {
  var novoJogo = new Jogo(req.body);

  Jogo.find({}).limit(1).sort({ numero: -1 }).exec((err, jog)=>{
    if (jog && jog !== [] && jog[0]){
      novoJogo.numero = jog[0].numero + 1;
    } 

    if (!novoJogo.numero){
      novoJogo.numero = 1;
    }

    Pontuacao.find({}, function(err, pontuacoes) {

      if (!pontuacoes)
        return res.status(440).json({ errmsg: "Pontuações não encontradas" });

      Parametro.findOne({ }, function(err, parametro) {
        if (!parametro)
          return res.status(440).json({ errmsg: "Parâmetros não encontrados" });

        var premiacaoPrimeiro = 0;
        var premiacaoSegundo = 0;
        var premiacaoTerceiro = 0;

        var qtdeRebuy = 0;

        for (var i = 0; i < novoJogo.participantes.length; i++){
          qtdeRebuy += novoJogo.participantes[i].rebuy;
        }

        var premiacaoTotal = (novoJogo.participantes.length * parametro.valorBuyIn)
                              + (qtdeRebuy * (parametro.valorBuyIn + parametro.valorMaleta));

        if (!parametro.participantesPremiacaoTerceiro){
          parametro.participantesPremiacaoTerceiro = 9999;
        }

        //colocar parâmetro

        if (novoJogo.participantes.length >= parametro.participantesPremiacaoTerceiro){
          premiacaoTerceiro = (parametro.valorBuyIn + parametro.valorMaleta);
          premiacaoSegundo = ((parametro.valorBuyIn + parametro.valorMaleta) * 2);
        } else {
          premiacaoSegundo = (parametro.valorBuyIn + parametro.valorMaleta);
        }

        premiacaoPrimeiro = ((premiacaoTotal - premiacaoSegundo - premiacaoTerceiro));

        //

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
            participante.valorInvestido += ((parametro.valorBuyIn + parametro.valorMaleta) * participante.rebuy);
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
              
              if (participante.dealer){
                jogadorParticipante.qtdVezesDealer++;
              }

              var historicoPosicao;

              if (participante.rebuy > 0){
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

                if (participante.dealer){
                  jogadorParticipante.qtdVezesDealer++;
                }  

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

                var strData = (novoJogo.data.getDate() + '/' + (novoJogo.data.getMonth() + 1) + '/' +  novoJogo.data.getFullYear());
                var lctoCaixa = new LancamentoCaixa({ data: novoJogo.data, valor: novoJogo.valorMaleta, descricao: 'Jogo - data: ' + strData, idJogo: jogo._id });

                lctoCaixa.save(function(err, lcto) {
                  if (err)
                    return res.status(440).json(err);

                  jogadorController.gerarClassificacaoEtapa(jogo.numero, function(err, classificacao){
                    return res.json(jogo);
                  });
                });
              });
            }
          });
        });
      });
    });
  });
};

exports.inserirDireto = function(req, res) {
  var novoJogo = new Jogo(req.body);
  var count = 0;
  novoJogo.participantes.forEach(function (participante){
    Jogador.findOne({ nome: participante.nomeJogador }, function(err, jogadorParticipante) {
      if (err)
        return res.status(440).json(err);

      if (jogadorParticipante){

        jogadorParticipante.pontos += participante.pontos;
        jogadorParticipante.valorRecebido += participante.valorRecebido;
        jogadorParticipante.valorInvestido += participante.valorInvestido;
        jogadorParticipante.jogos++;

        var historicoPosicao;

        if (participante.rebuy > 0){
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

};

exports.consultar = function(req, res) {
  Jogo.findById(req.params.jogoId, function(err, jogo) {
    if (err)
      return res.status(440).json(err);
    return res.json(jogo);
  });
};

exports.alterar = function(req, res) {
  //this.excluir(req, res);

  //return this.incluir(req, res);
  Jogo.findOneAndUpdate({_id: req.params.jogoId}, req.body, {new: true}, function(err, jogo) {
    if (err)
      return res.status(440).json(err);
    return res.json(jogo);
  });
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

            if (participante.rebuy > 0){
              historicoPosicao = jogadorParticipante.historicoJogos.find(function(element, index, array) { return element.lugar === -1 });
            } else {
              historicoPosicao = jogadorParticipante.historicoJogos.find(function(element, index, array) { return element.lugar === participante.lugar });
            }

            if (historicoPosicao){
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

    LancamentoCaixa.remove({
      idJogo: jogo._id
    }, function(err, jogo) {
      if (err)
        return res.status(440).json(err);
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

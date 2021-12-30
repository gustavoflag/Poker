var sortBy = require('sort-by');
var mongoose = require('mongoose');
var jogadorOrders = require('../helpers/jogadorOrders.js');

Jogador = mongoose.model('Jogador');
Jogo = mongoose.model('Jogo');
ClassificacaoEtapa = mongoose.model('ClassificacaoEtapa');

exports.listar = async function(req, res) {
  try {
    const jogadores = await Jogador.find({});
    return res.json(jogadores.sort(sortBy('nome')));
  } catch(err) {
    return res.status(440).json(err);
  }
};

exports.exportar = async function(req, res){
  try{
    const jogadores = await Jogador.find({});

    var jogadoresExport = [];

    jogadores.forEach((jogador) => {
      var jogExport = new Jogador();
      jogExport.nome = jogador.nome;
      jogExport.titulos = jogador.titulos;
      jogExport.socio = jogador.socio;
      jogExport._id = undefined;

      jogadoresExport.push(jogExport);
    });

    return res.json(jogadoresExport.sort(sortBy('nome')));
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.classificacao = async function(req, res) {
  var ordem = req.params.ordem;

  if (!ordem)
    ordem = "P";

  try{
    var jogadores = await classificacaoGeral(ordem);

    jogadores.map((jogador, index) => jogador.classificacao = index + 1);

    return res.json(jogadores);
  } catch(err){
    return res.status(440).json(err);
  }
};

exports.classificacaoRookies = async function(req, res) {
  var ordem = req.params.ordem;

  if (!ordem)
    ordem = "P";

  try{
    var jogadores = await classificacaoGeral(ordem);

    var rookies = jogadores.filter((j) => j.rookie === true);

    rookies.map((jogador, index) => jogador.classificacao = index + 1);

    return res.json(rookies);
  } catch(err){
    return res.status(440).json(err);
  }
};

exports.classificacaoMes = function(req, res){
  classMes(req.params.ano, req.params.mes, function (err, mes){
    if (err)
      return res.status(440).json(err);

    return res.json(mes);
  });
};

exports.classificacaoTodosMeses = function(req, res){
  var dataAtual = new Date();
  var ano = dataAtual.getFullYear();
  var mesAno = dataAtual.getMonth() + 1;

  if (req.params.ano && ano != req.params.ano){
    ano = req.params.ano;
    mesAno = 12;
  }
  
  var meses = [];

  for (var i = mesAno; i > 0; i--){
    classMes(ano, i, function (err, mes){
      if (err)
        return res.status(440).json(err);

      meses.push(mes);

      if (meses.length == mesAno){
        return res.json(meses.sort(compararMeses));
      }
    });
  }
};

exports.classificacaoEtapa = function(req, res){
  gerarClassificacaoEtapa(req.params.etapa, function(err, classificacao){
    if (err)
      return res.status(440).json(err);

    return res.json(classificacao);
  });
};

exports.classificacaoTodasEtapas = function(req, res){
  Jogo.find({}, function(err, jogos) {
    if (err)
      return res.status(440).json(err);

    var qtdJogos = jogos.length;
    var etapasSalvas = 0;

    for(var i = 1; i < qtdJogos + 1; i++){
      classEtapa(i, function(err, etapa){
        if (err)
          return res.status(440).json(err);
        
        var novaEtapa = new ClassificacaoEtapa(etapa);
        etapasSalvas++;

        novaEtapa.save(function(err, task) {
          if (err)
            return res.status(440).json(err);

          if (etapasSalvas == qtdJogos){
            //return res.json({ res: "classificacao etapas gerada" });
          }
        });
      });
    }    
  });
};

exports.listarClassificacaoTodasEtapas = function(req, res) {
  ClassificacaoEtapa.find({}, function(err, classificacoes) {
    if (err)
      return res.status(440).json(err);

    return res.json(classificacoes.sort(compararEtapas));
  });
};

exports.classificacaoJogadorEtapa = function(req, res) {
  ClassificacaoEtapa.find({}, function(err, classificacoes) {
    if (err)
      return res.status(440).json(err);

    var pontuacaoEtapas = [];

    classificacoes.forEach(classif => {
      classif.classificacao.forEach(jogadorEtapa => {

        var pontuacaoEtapa = null;
        for (var i = 0; i < pontuacaoEtapas.length; i++){
          if (pontuacaoEtapas[i].nomeJogador === jogadorEtapa.nomeJogador){
            pontuacaoEtapa = pontuacaoEtapas[i];
            break;
          }
        }

        var pontosEtapa = {
          etapa: classif.etapa,
          pontos: jogadorEtapa.pontos
        };

        if (!pontuacaoEtapa){
          var novaPontuacaoEtapa = {
            nomeJogador: jogadorEtapa.nomeJogador,
            pontosEtapa: []
          };

          novaPontuacaoEtapa.pontosEtapa.push(pontosEtapa);

          pontuacaoEtapas.push(novaPontuacaoEtapa);
        } else {
          //jogador.pontos += participante.pontos;

          pontuacaoEtapa.pontosEtapa.push(pontosEtapa);
          pontuacaoEtapa.pontosEtapa.sort(compararEtapas);
        }
      });
    });

    var countJogadores = 0;
    pontuacaoEtapas.forEach((pontuacaoEtapa) => {
      Jogador.findOne({ nome: pontuacaoEtapa.nomeJogador }).then((jogador) => {
        if (err)
          return res.status(440).json(err);

        jogador.pontuacaoEtapas = pontuacaoEtapa.pontosEtapa;

        jogador.save()
          .then((jog) => {
            countJogadores++;
            if (countJogadores == pontuacaoEtapas.length){
              return res.json(pontuacaoEtapas);
            }
          })
          .catch((err) => {
            return res.status(440).json(err);
          });
      })
      .catch((err) => {
        console.log('err', err);
        return res.status(440).json(err);
      });
    });
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

exports.inserirLote = function(req, res){
  var jogadores = req.body;

  var count = 0;
  jogadores.forEach((jogadorBody) => {
    var novoJogador = new Jogador(jogadorBody);

    novoJogador.historicoJogos = [];
    novoJogador.historicoJogos.push({ lugar:-1, quantidade:0 });

    for (var i = 1; i <= 15; i++){
      novoJogador.historicoJogos.push({ lugar:i, quantidade:0 });
    }

    novoJogador.save(function(err, task) {
      if (err)
        return res.status(440).json(err);
    });

    count++;
    if (count === jogadores.length){
      return res.json(jogadores);
    }
  });
};

exports.consultar = async function(req, res) {
  try{
    var jogador = await Jogador.findById(req.params.jogadorId);

    getEstatisticasJogador(jogador);

    var jogadores = await classificacaoGeral("P");

    jogadores.map(j => getEstatisticasJogador(j));

    jogador.posicaoRanking = encontraPosicao(jogadores, jogador.nome);
    jogador.posicaoVitorias = encontraPosicao(sortJogadores(jogadores, "V"), jogador.nome);
    jogador.posicaoHU = encontraPosicao(sortJogadores(jogadores, "HU"), jogador.nome);
    jogador.posicaoPontuacoes = encontraPosicao(sortJogadores(jogadores, "PO"), jogador.nome);
    jogador.posicaoPontosPorJogo = encontraPosicao(sortJogadores(jogadores, "PPJ"), jogador.nome);
    jogador.posicaoMediaPosicao = encontraPosicao(sortJogadores(jogadores, "MP"), jogador.nome);

    var jogos = await Jogo.find({ participantes: {$elemMatch: { nomeJogador: jogador.nome, lugar: 1 }}});

    jogos.forEach((jogo) => {
      var resumoJogo = {
        _id: jogo._id,
        data: jogo.data
      };
  
      jogador.vitorias.push(resumoJogo);
    });

    return res.json(jogador);

  } catch (err) {
    console.log('error - consultar:', err);
    return res.status(440).json(err);
  }
};

exports.consultarPorNome = async function(req, res) {
  try{
    var jogador = await Jogador.findOne({nome: req.params.nomeJogador});

    getEstatisticasJogador(jogador);
  } catch (err) {
    return res.status(440).json(err);
  }
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

exports.gerarClassificacaoEtapa = function(etapa, callback){
  gerarClassificacaoEtapa(etapa, callback);
};

//Funções
function classMes(ano, mes, callback){
  var jogadores = [];

  Jogo.find({ data: {"$gte": new Date(ano, mes - 1, 1), "$lt": new Date(ano, mes, 1) }}, function(err, jogos) {
    if (err)
      callback(err, null);

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
            pontos: participante.pontos,
            vitorias: participante.lugar === 1 ? 1 : 0,
            HUs: participante.lugar <= 2 ? 1 : 0
          };

          jogadores.push(novoJogador);
        } else {

          if (participante.lugar === 1){
            jogador.vitorias++;
          }

          if (participante.lugar <= 2){
            jogador.HUs++;
          }

          jogador.pontos += participante.pontos;
        }
      });
    });

    nomeMes(mes, function (nome) {
      var retorno = {
        ano: ano,
        mes: mes,
        nomeMes: nome,
        classificacao: jogadores.sort(jogadorOrders.compararPontos)
      };

      callback(null, retorno);
    });
  });
};

function classEtapa(etapa, callback){
  var jogadores = [];

  Jogo.find({ numero: { $lte: etapa }}, function(err, jogos) {
    if (err)
      callback(err, null);

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

      var retorno = {
        etapa: etapa,
        classificacao: jogadores.sort(jogadorOrders.compararPontos)
      };

      callback(null, retorno);
  });
};

function gerarClassificacaoEtapa(etapa, callback){
  classEtapa(etapa, function(err, classificacao){
    if (err)
      callback(err, null);    

    ClassificacaoEtapa.findOne({ etapa: etapa }, function(err, classBanco){
      if (!classBanco){
        var novaEtapa = new ClassificacaoEtapa(classificacao);

        novaEtapa.save(function(err, task) {
          if (err)
            callback(err, null);

          var countJogadores = 0;
          novaEtapa.classificacao.forEach(jogadorEtapa => {
            Jogador.findOne({ nome: jogadorEtapa.nomeJogador }, function(err, jogBanco){
              var indexEtapa = jogBanco.pontuacaoEtapas.map(function(e){ return e.etapa }).indexOf(novaEtapa.etapa);
              if (indexEtapa && indexEtapa != -1){
                jogBanco.pontuacaoEtapas[indexEtapa].pontos = jogadorEtapa.pontos;
              } else {
                var novaPontuacaoEtapa = { etapa: novaEtapa.etapa, pontos: jogadorEtapa.pontos };
                jogBanco.pontuacaoEtapas = jogBanco.pontuacaoEtapas.concat([novaPontuacaoEtapa]);
              }

              jogBanco.save(function(err, jog) {
                if (err)
                  callback(err, null);

                countJogadores++;
                if (countJogadores == novaEtapa.classificacao.length){
                  callback(null, classificacao);
                }
              });
            });
          })
        });
      } else {
        callback(null, classificacao);
      }
    });
  });
};

async function classificacaoGeral(ordem){
  const qtdJogos = await Jogo.count({});
  var jogadores;

  if (qtdJogos > 0){
    jogadores = await Jogador.find({ jogos: { $gte: 1 } }).lean();
  } else {
    jogadores = await Jogador.find({}).lean();
  }

  return sortJogadores(jogadores, ordem);
};

function sortJogadores(jogadores, ordem){
  try{
    switch(ordem){
      case "P":
        return jogadores.sort(jogadorOrders.compararJogadores);
      case "V":
        return jogadores.sort(jogadorOrders.compararVitorias);
      case "PPJ":
        return jogadores.sort(jogadorOrders.compararPontosPorJogo);
      case "VR":
        return jogadores.sort(jogadorOrders.compararValorRecebido);
      case "S":
        return jogadores.sort(jogadorOrders.compararSaldo);
      case "D":
        return jogadores.filter(jog => jog.socio).sort(jogadorOrders.compararVezesDealer);
      case "PO": 
        return jogadores.sort(jogadorOrders.compararPontuacoes);
      case "MP":
        return jogadores.sort(jogadorOrders.compararMediaPosicao);
      case "HU":
        return jogadores.sort(jogadorOrders.compararHUs);
    }
  } catch(err){
    console.log('erro sortJogadores: ', err);
    throw(err);
  }
};

function getEstatisticasJogador(jogador){
  jogador.pontosPorJogo = jogador.pontos / jogador.jogos;

  jogador.qtdHUs = 0;
  jogador.qtdPontuacoes = 0;
  jogador.mediaPosicao = 0;
  jogador.qtdVitorias = 0;

  jogador.historicoJogos.forEach((historico) => {
    if (historico.lugar <= 10 && historico.lugar > 0){
      jogador.qtdPontuacoes += historico.quantidade;
    }
    if (historico.lugar <= 2 && historico.lugar > 0){
      jogador.qtdHUs += historico.quantidade;
    }
    if (historico.lugar == 1){
      jogador.qtdVitorias += historico.quantidade;
    }
    if (historico.lugar > 0){
      jogador.mediaPosicao += (historico.lugar * historico.quantidade);
    }
  });

  jogador.mediaPosicao = jogador.mediaPosicao / jogador.jogos;
};

function compararMeses(a, b){
  var diffMeses = (a.mes - b.mes);
  if (diffMeses != 0){
    return diffMeses * -1;
  }
};

function compararEtapas(a, b){
  var diffEtapas = (a.etapa - b.etapa);
  if (diffEtapas != 0){
    return diffEtapas;
  }
};

function encontraPosicao(jogadorArray, nomeJogador){
  if (!Array.isArray(jogadorArray)){
    return undefined;
  }

  return (jogadorArray.findIndex(j => j.nome == nomeJogador) + 1);
};

function nomeMes(indice, callback){
    var nomeMesI;

    if (Number(indice) == 1)
    {
      nomeMesI = 'Janeiro';
    } else if (Number(indice) == 2)
    {
      nomeMesI = 'Fevereiro';
    } else if (Number(indice) == 3)
    {
      nomeMesI = 'Março';
    } else if (Number(indice) == 4)
    {
      nomeMesI = 'Abril';
    } else if (Number(indice) == 5)
    {
      nomeMesI = 'Maio';
    } else if (Number(indice) == 6)
    {
      nomeMesI = 'Junho';
    } else if (Number(indice) == 7)
    {
      nomeMesI = 'Julho';
    } else if (Number(indice) == 8)
    {
      nomeMesI = 'Agosto';
    } else if (Number(indice) == 9)
    {
      nomeMesI = 'Setembro';
    } else if (Number(indice) == 10)
    {
      nomeMesI = 'Outubro';
    } else if (Number(indice) == 11)
    {
      nomeMesI = 'Novembro';
    } else if (Number(indice) == 12)
    {
      nomeMesI = 'Dezembro';
    }

    return callback(nomeMesI);
};

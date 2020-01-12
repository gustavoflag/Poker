var sortBy = require('sort-by');
var mongoose = require('mongoose');
var jogadorOrders = require('../helpers/jogadorOrders.js');
Jogador = mongoose.model('Jogador');
Jogo = mongoose.model('Jogo');

exports.listar = function(req, res) {
  Jogador.find({}, function(err, jogadores) {
    if (err)
      return res.status(440).json(err);
    return res.json(jogadores.sort(sortBy('nome')));
  });
};

exports.exportar = function(req, res){
  Jogador.find({}, function(err, jogadores) {
    if (err)
      return res.status(440).json(err);

    var jogadoresExport = [Jogador];

    jogadores.forEach((jogador) => {
      var jogExport = new Jogador();
      jogExport.nome = jogador.nome;
      jogExport.titulos = jogador.titulos;
      jogadoresExport.push(jogExport);
    });

    return res.json(jogadoresExport.sort(sortBy('nome')));
  });
};

exports.classificacao = function(req, res) {
  var ordem = req.params.ordem;

  if (!ordem)
    ordem = "P";

  classificacaoGeral(ordem, function(err, jogadores){
    if (err)
      return res.status(440).json(err);

    var i = 1;

    jogadores.forEach(jogador => {
      jogador.classificacao = i;
      i++;
    });

    return res.json(jogadores);
  });
};

exports.classificacaoRookies = function(req, res) {
  var ordem = req.params.ordem;

  if (!ordem)
    ordem = "P";

  classificacaoGeral(ordem, function(err, jogadores){
    if (err)
      return res.status(440).json(err);
    return res.json(jogadores.filter((j) => j.rookie === true));
  });
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

exports.consultar = function(req, res) {
  Jogador.findById(req.params.jogadorId, function(err, jogador) {
    if (err)
      return res.status(440).json(err);

    classificacaoGeral("P", function(err, jogadores){
      if (err)
        return res.status(440).json(err);

      getEstatisticasJogador(jogador);

      //posicões relativas ao ranking
      jogador.posicaoRanking = encontraPosicao(jogadores, jogador.nome);
      jogador.posicaoVitorias = encontraPosicao(jogadores.sort(jogadorOrders.compararVitorias), jogador.nome);
      jogador.posicaoHU = encontraPosicao(jogadores.sort(jogadorOrders.compararHUs), jogador.nome);
      jogador.posicaoPontuacoes = encontraPosicao(jogadores.sort(jogadorOrders.compararPontuacoes), jogador.nome);
      jogador.posicaoPontosPorJogo = encontraPosicao(jogadores.sort(jogadorOrders.compararPontosPorJogo), jogador.nome);
      jogador.posicaoMediaPosicao = encontraPosicao(jogadores.sort(jogadorOrders.compararMediaPosicao), jogador.nome);

      Jogo.find({ participantes: {$elemMatch: { nomeJogador: jogador.nome, lugar: 1 }}}, function(err, jogos){
        if (err)
          return res.status(440).json(err);

        jogos.forEach((jogo) => {
          var resumoJogo = {
            _id: jogo._id,
            data: jogo.data
          };

          jogador.vitorias.push(resumoJogo);
        });

        return res.json(jogador);
      });
    });
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

function classificacaoGeral(ordem, callback){
  Jogador.find({}, function(err, jogadores) {
    if (err)
      callback(err, null);

    jogadores.forEach(jogador => getEstatisticasJogador(jogador));

    switch(ordem){
      case "P":
        callback(null, jogadores.sort(jogadorOrders.compararJogadores));
        break;
      case "V":
        callback(null, jogadores.sort(jogadorOrders.compararVitorias));
        break;
      case "PPJ":
        callback(null, jogadores.sort(jogadorOrders.compararPontosPorJogo));
        break;
      case "VR":
        callback(null, jogadores.sort(jogadorOrders.compararValorRecebido));
        break;
      case "S":
        callback(null, jogadores.sort(jogadorOrders.compararSaldo));
        break;
    }

  });
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
}

function encontraPosicao(jogadores, nomeJogador){
  return (jogadores.findIndex(j => j.nome == nomeJogador) + 1);
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
}

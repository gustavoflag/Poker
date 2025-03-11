const mongoose = require('mongoose');
const sortBy = require('sort-by');
const jogadorController = require('./jogadorController.js');
const Jogo = mongoose.model('Jogo');
const Jogador = mongoose.model('Jogador');
const Pontuacao = mongoose.model('Pontuacao');
const Parametro = mongoose.model('Parametro');
const LancamentoCaixa = mongoose.model('LancamentoCaixa');
const ClassificacaoEtapa = mongoose.model('ClassificacaoEtapa');
const TipoPontuacao = mongoose.model('TipoPontuacao');

exports.listar = async (req, res) => {
  try {
    let jogos = await Jogo.find({});

    jogos.forEach((jogo) => {
      if (jogo.participantes) {
        jogo.participantes = jogo.participantes.sort(sortBy('lugar'));
      }
    });

    return res.json(jogos.sort(sortBy('-data')));
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.quantidade = async (req, res) => {
  try {
    const jogos = await Jogo.find({});

    return res.json(jogos.length);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.inserir = async (req, res) => {
  try {
    var novoJogo = new Jogo(req.body);

    const jog = await Jogo.find({}).limit(1).sort({ numero: -1 }).exec();

    if (jog && jog.length > 0 && jog[0]) {
      novoJogo.numero = jog[0].numero + 1;
    }

    if (!novoJogo.numero) {
      novoJogo.numero = 1;
    }

    const tipoPontuacao = await TipoPontuacao.findOne({ maxJogadores: { $gte: novoJogo.participantes.length }, minJogadores: { $lte: novoJogo.participantes.length } });
    if (!tipoPontuacao){
      return res.status(440).json({ errmsg: "Pontuações não encontradas" });
    }

    if (tipoPontuacao.pontuacoes.find((pontuacao) => pontuacao.lugar === 1).pontos < 25) {
      novoJogo.observacoes = "Etapa com pontuação parcial";
    }
      
    const parametro = await Parametro.findOne({});
    if (!parametro)
      return res.status(440).json({ errmsg: "Parâmetros não encontrados" });

    var qtdeRebuy = 0;

    for (var i = 0; i < novoJogo.participantes.length; i++) {
      qtdeRebuy += novoJogo.participantes[i].rebuy;
    }

    const {
      premiacaoPrimeiro,
      premiacaoSegundo,
      premiacaoTerceiro,
      valorMaleta,
      valorTaxaLimpeza,
      valorCaixa
    } = await this.premiacao(novoJogo.participantes.length, qtdeRebuy);

    novoJogo.valorMaleta = valorMaleta;

    var count = 0;

    novoJogo.participantes.forEach(async (participante) => {
      participante.valorInvestido = parametro.valorBuyIn + parametro.valorMaleta + parametro.valorCaixa;

      if (!participante.rebuy) {
        var pontuacao = tipoPontuacao.pontuacoes.find((pontuacao) => pontuacao.lugar === participante.lugar);

        if (pontuacao) {
          participante.pontos = pontuacao.pontos;
        }
      } else {
        participante.valorInvestido += ((parametro.valorBuyIn + parametro.valorMaleta + parametro.valorCaixa) * participante.rebuy);
      }

      if (parametro.pontosExtraKO && parametro.pontosExtraKO > 0) {
        if (participante.pontoExtra) {
          var participantesPontoExtra = novoJogo.participantes.filter(p => p.pontoExtra);
          if (participantesPontoExtra && participantesPontoExtra.length > 1) {
            participante.qtdPontosExtra = Math.ceil(parametro.pontosExtraKO / participantesPontoExtra.length);
          } else {
            participante.qtdPontosExtra = parametro.pontosExtraKO;
          }

          participante.pontos += participante.qtdPontosExtra;
        }
      } else {
        participante.qtdPontosExtra = 0;
      }

      if (participante.lugar === 1) {
        participante.valorRecebido = premiacaoPrimeiro;
      } else if (participante.lugar === 2) {
        participante.valorRecebido = premiacaoSegundo;
      } else if (participante.lugar === 3) {
        participante.valorRecebido = premiacaoTerceiro;
      }

      var jogadorParticipante = await Jogador.findOne({ nome: participante.nomeJogador });
      if (!jogadorParticipante) {
        var novoJogador = new Jogador({ nome: participante.nomeJogador });

        const jog = await novoJogador.save();

        jogadorParticipante = jog;
      }

      jogadorParticipante.pontos += participante.pontos;
      jogadorParticipante.pontosExtra += participante.qtdPontosExtra;
      jogadorParticipante.valorRecebido += participante.valorRecebido;
      jogadorParticipante.valorInvestido += participante.valorInvestido;
      jogadorParticipante.jogos++;

      if (participante.dealer) {
        jogadorParticipante.qtdVezesDealer++;
      }

      var historicoPosicao;

      if (participante.rebuy > 0) {
        historicoPosicao = jogadorParticipante.historicoJogos.find(function (element, index, array) { return element.lugar === -1 });
      } else {
        historicoPosicao = jogadorParticipante.historicoJogos.find(function (element, index, array) { return element.lugar === participante.lugar });
      }

      if (!historicoPosicao) {
        jogadorParticipante.historicoJogos.concat({ lugar: participante.lugar, quantidade: 1 });
      } else {
        historicoPosicao.quantidade++;
      }

      await jogadorParticipante.save();

      count++;
      if (count === novoJogo.participantes.length) {
        const jogo = await novoJogo.save();

        var strData = (novoJogo.data.getDate() + '/' + (novoJogo.data.getMonth() + 1) + '/' + novoJogo.data.getFullYear());

        var lctoPremio = new LancamentoCaixa({ data: novoJogo.data, conta: 'premio', valor: novoJogo.valorMaleta, descricao: `Jogo #${novoJogo.numero} - data: ${strData}`, idJogo: jogo._id });
        await lctoPremio.save();

        var lctoLimpeza = new LancamentoCaixa({ data: novoJogo.data, conta: 'limpeza', valor: valorTaxaLimpeza, descricao: `Taxa limpeza #${novoJogo.numero} - data: ${strData}`, idJogo: jogo._id });
        await lctoLimpeza.save();

        var lctoCaixa = new LancamentoCaixa({ data: novoJogo.data, conta: 'caixa', valor: valorCaixa, descricao: `Caixa Jogo #${novoJogo.numero} - data: ${strData}`, idJogo: jogo._id });
        await lctoCaixa.save();

        jogadorController.gerarClassificacaoEtapa(jogo.numero, function (err, classificacao) {
          return res.json(jogo);
        });
      }
    });
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.inserirDireto = async (req, res) => {
  var novoJogo = new Jogo(req.body);
  var count = 0;
  novoJogo.participantes.forEach(async (participante) => {
    var jogadorParticipante = await Jogador.findOne({ nome: participante.nomeJogador });

    if (!jogadorParticipante) {
      var novoJogador = new Jogador({ nome: participante.nomeJogador });
      const jog = await novoJogador.save();

      jogadorParticipante = jog;
    }

    jogadorParticipante.pontos += participante.pontos;
    jogadorParticipante.valorRecebido += participante.valorRecebido;
    jogadorParticipante.valorInvestido += participante.valorInvestido;
    jogadorParticipante.jogos++;

    var historicoPosicao;

    if (participante.rebuy > 0) {
      historicoPosicao = jogadorParticipante.historicoJogos.find(function (element, index, array) { return element.lugar === -1 });
    } else {
      historicoPosicao = jogadorParticipante.historicoJogos.find(function (element, index, array) { return element.lugar === participante.lugar });
    }

    if (!historicoPosicao) {
      jogadorParticipante.historicoJogos.concat({ lugar: participante.lugar, quantidade: 1 });
    } else {
      historicoPosicao.quantidade++;
    }

    await jogadorParticipante.save();

    count++;
    if (count === novoJogo.participantes.length) {
      const jogo = await novoJogo.save();

      return res.json(jogo);
    }
  });
};

exports.consultar = async (req, res) => {
  try {
    const jogo = await Jogo.findById(req.params.jogoId);

    return res.json(jogo);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.alterar = async (req, res) => {
  try {
    //this.excluir(req, res);

    //return this.incluir(req, res);
    const jogo = await Jogo.findOneAndUpdate({ _id: req.params.jogoId }, req.body, { new: true });

    return res.json(jogo);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.excluir = async (req, res) => {
  try {
    var jogo = await Jogo.findById(req.params.jogoId);

    jogo.participantes.forEach(async (participante) => {
      var jogadorParticipante = await Jogador.findOne({ nome: participante.nomeJogador });

      if (jogadorParticipante) {

        jogadorParticipante.pontos -= participante.pontos;
        jogadorParticipante.pontosExtra -= participante.qtdPontosExtra;
        jogadorParticipante.valorInvestido -= participante.valorInvestido;
        jogadorParticipante.valorRecebido -= participante.valorRecebido;
        jogadorParticipante.jogos--;

        if (participante.dealer) {
          jogadorParticipante.qtdVezesDealer--;
        }

        var historicoPosicao;

        if (participante.rebuy > 0) {
          historicoPosicao = jogadorParticipante.historicoJogos.find((element) => element.lugar === -1);
        } else {
          historicoPosicao = jogadorParticipante.historicoJogos.find((element) => element.lugar === participante.lugar);
        }

        if (historicoPosicao) {
          historicoPosicao.quantidade--;
        }

        const indicePontuacao = jogadorParticipante.pontuacaoEtapas.findIndex((pontuacaoEtapa) => pontuacaoEtapa.etapa === jogo.numero);

        jogadorParticipante.pontuacaoEtapas.splice(indicePontuacao, 1);

        await jogadorParticipante.save();
      }
    });

    await ClassificacaoEtapa.remove({
      etapa: jogo.numero
    });

    await LancamentoCaixa.remove({
      idJogo: jogo._id
    });

    await Jogo.remove({
      _id: jogo._id
    });

    return res.json({ message: 'Jogo excluído' });

  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.premiacao = async (qtdParticipantes, qtdRebuy) => {
  const parametro = await Parametro.findOne({});
  if (!parametro)
    return res.status(440).json({ errmsg: "Parâmetros não encontrados" });

  var premiacaoPrimeiro = 0;
  var premiacaoSegundo = 0;
  var premiacaoTerceiro = 0;
  var valorMaleta = 0;

  var valorTaxaLimpeza = 55;
  if (parametro.valorTaxaLimpeza) {
    valorTaxaLimpeza = parametro.valorTaxaLimpeza;
  }

  const valorBuyInComMaleta = (parametro.valorBuyIn + parametro.valorMaleta);

  var premiacaoTotal = (qtdParticipantes * parametro.valorBuyIn)
    + (qtdRebuy * valorBuyInComMaleta)
    - (valorTaxaLimpeza);

  if (!parametro.participantesPremiacaoTerceiro) {
    parametro.participantesPremiacaoTerceiro = 9999;
  }

  if (qtdParticipantes >= parametro.participantesPremiacaoTerceiro) {
    premiacaoTerceiro = (premiacaoTotal * (parametro.premiacaoTerceiro / 100));
    if (premiacaoTerceiro < valorBuyInComMaleta + parametro.valorCaixa) {
      premiacaoTerceiro = valorBuyInComMaleta + parametro.valorCaixa;
    }

    premiacaoSegundo = (premiacaoTotal * (parametro.premiacaoSegundo / 100));
    if (premiacaoSegundo < valorBuyInComMaleta + parametro.valorCaixa) {
      premiacaoSegundo = valorBuyInComMaleta + parametro.valorCaixa;
    }
  } else {
    premiacaoSegundo = valorBuyInComMaleta + parametro.valorCaixa;
  }

  premiacaoPrimeiro = ((premiacaoTotal - premiacaoSegundo - premiacaoTerceiro));

  valorMaleta = qtdParticipantes * parametro.valorMaleta;
  valorCaixa = (qtdParticipantes + qtdRebuy) * parametro.valorCaixa;

  return {
    premiacaoPrimeiro,
    premiacaoSegundo,
    premiacaoTerceiro,
    valorMaleta,
    valorTaxaLimpeza,
    valorCaixa
  }
}
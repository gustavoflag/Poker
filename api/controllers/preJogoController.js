const sortBy = require('sort-by');
const mongoose = require('mongoose');
const randomItem = require('random-item');
const jogoController = require('./jogoController.js');
const PreJogo = mongoose.model('PreJogo');

const salvarPreJogo = async (res, preJogo, mensagem) => {
  try {
    const preJogoDB = await preJogo.save();

    return res.json({ message: mensagem, obj: preJogoDB });
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.consultar = async (req, res) => {
  try {
    const preJogo = await PreJogo.findOne({}).lean();

    if (preJogo && preJogo.participantes && preJogo.participantes.length >= 6){
      const qtdJogadores = preJogo.participantes.length;

      var qtdRebuy = 0;
      for (var i = 0; i < preJogo.participantes.length; i++) {
        qtdRebuy += preJogo.participantes[i].rebuy;
      }

      const premiacao = await jogoController.premiacao(qtdJogadores, qtdRebuy);
      preJogo.estimativaPremio = premiacao;
    }

    return res.json(preJogo);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.inserir = async (req, res) => {
  var novoPreJogo = new PreJogo(req.body);

  await salvarPreJogo(res, novoPreJogo, 'Pré-Jogo salvo');
};

exports.adicionarJogador = async (req, res) => {
  try {
    const preJogo = await PreJogo.findOne({});

    var jogador = preJogo.participantes.filter((par) => par.nomeJogador === req.body.nomeJogador)[0];
    if (jogador) {
      return res.status(440).json({ message: 'Jogador já no jogo' });
    }

    var qtdMenor = 0;
    var mesaMenor = 0;
    var msgRetorno = "Jogador incluído com sucesso";

    if (preJogo.sorteado) {
      for (var i = 1; i <= preJogo.qtdMesas; i++) {
        var qtdI = preJogo.participantes.filter((p) => p.mesa === i).length;
        if (qtdMenor === 0 || qtdI < qtdMenor) {
          qtdMenor = qtdI;
          mesaMenor = i;
        }
      }

      msgRetorno = `${req.body.nomeJogador} incluído na mesa ${mesaMenor}`;

      req.body.mesa = mesaMenor;
      req.body.lugarNaMesa = qtdMenor + 1;
    }

    preJogo.participantes = preJogo.participantes.concat(req.body);

    await salvarPreJogo(res, preJogo, msgRetorno);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.excluirJogador = async (req, res) => {
  try {
    const preJogo = await PreJogo.findOne({});
    if (!preJogo) {
      return res.status(440).json({ message: 'Pré jogo não encontrado' });
    }

    var indiceJogador = preJogo.participantes.findIndex((par) => par.nomeJogador === req.body.nomeJogador);
    if (indiceJogador === -1) {
      return res.status(440).json({ message: 'Jogador não encontrado' });
    }

    preJogo.participantes.splice(indiceJogador, 1);

    await salvarPreJogo(res, preJogo, 'Jogador Excluído');

  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.alterarJogador = async (req, res) => {
  try {
    const preJogo = await PreJogo.findOne({});

    if (!preJogo) {
      return res.status(440).json({ message: 'Pré jogo não encontrado' });
    }

    var jogador = preJogo.participantes.filter((par) => par.nomeJogador === req.body.nomeJogador)[0];
    if (!jogador) {
      return res.status(440).json({ message: 'Jogador não encontrado' });
    }

    if (req.body.eliminado) {
      jogador.eliminado = req.body.eliminado;
    } else {
      jogador.eliminado = false;
    }

    if (req.body.lugar) {
      jogador.lugar = req.body.lugar;
    } else {
      jogador.lugar = undefined;
    }

    if (req.body.rebuy) {
      jogador.rebuy = req.body.rebuy;
    } else {
      jogador.rebuy = 0;
    }

    if (req.body.pago) {
      jogador.pago = req.body.pago;
    } else {
      jogador.pago = false;
    }

    if (req.body.timeChip) {
      jogador.timeChip = req.body.timeChip;
    } else {
      jogador.timeChip = false;
    }

    if (req.body.pontoExtra) {
      jogador.pontoExtra = req.body.pontoExtra;
    } else {
      jogador.pontoExtra = false;
    }

    var listaOrdenadaMesa = preJogo.participantes.filter((par) => !par.eliminado).sort(sortBy('lugarNaMesa'));

    preJogo.participantes = listaOrdenadaMesa.concat(preJogo.participantes.filter((par) => par.eliminado).sort(sortBy('lugar')));

    await salvarPreJogo(res, preJogo, 'Jogador alterado');
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.sortear = async (req, res) => {
  try {
    const preJogo = await PreJogo.findOne({});

    if (!preJogo) {
      return res.status(440).json({ message: 'Pré-jogo não encontrado' });
    }

    var listaOrdenada = [];
    var length = preJogo.participantes.filter((par) => !par.eliminado).length;

    var tamanhoMaximoMesa = 11;
    preJogo.qtdMesas = Math.ceil(length / tamanhoMaximoMesa);
    var indiceDivisao = Math.ceil(length / preJogo.qtdMesas);
    preJogo.sorteado = true;

    //length -= preJogo.qtdMesas; //Tirando os dealers que sorteiam primeiro

    if (!req.body.redraw) {
      for (var mesa = 1; mesa < preJogo.qtdMesas + 1; mesa++) {

        var minimoVezesDealer = preJogo.participantes.filter((par) => !par.eliminado && par.socio).reduce((min, par) => par.qtdVezesDealer < min ? par.qtdVezesDealer : min, preJogo.participantes[0].qtdVezesDealer);

        //console.log('minimoVezesDealer', minimoVezesDealer);

        var participante = randomItem(preJogo.participantes.filter((par) => !par.eliminado && par.socio && par.qtdVezesDealer == minimoVezesDealer));

        participante.mesa = mesa;
        participante.lugarNaMesa = 1;
        if (!req.body.redraw || req.body.redraw == false) {
          participante.dealer = true;
        }

        listaOrdenada.push(participante);

        //console.log('mesa:', participante.mesa, 'lugar:', participante.lugarNaMesa, 'nome:', participante.nomeJogador);

        var indexRemove = preJogo.participantes.indexOf(participante);
        preJogo.participantes.splice(indexRemove, 1);
      }
    }

    for (var i = (req.body.redraw ? 0 : 1); i < length; i++) {
      if (!req.body.redraw && i % indiceDivisao == 0) {
        continue;
      }
      var participante = randomItem(preJogo.participantes.filter((par) => !par.eliminado));

      participante.mesa = Math.ceil((i + 1) / indiceDivisao);
      participante.lugarNaMesa = (i % indiceDivisao) + 1;

      listaOrdenada.push(participante);

      //console.log('mesa:', participante.mesa, 'lugar:', participante.lugarNaMesa, 'nome:', participante.nomeJogador);

      var indexRemove = preJogo.participantes.indexOf(participante);
      preJogo.participantes.splice(indexRemove, 1);
    }

    preJogo.participantes.filter((par) => par.eliminado).forEach((p) => {
      p.mesa = null;
    });

    preJogo.participantes = listaOrdenada.concat(preJogo.participantes.filter((par) => par.eliminado).sort(sortBy('lugar')));

    await salvarPreJogo(res, preJogo, 'Sorteio realizado');
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.gerarJogo = async (req, res) => {
  try {
    const preJogo = await PreJogo.findOne({});
    if (!preJogo) {
      return res.status(440).json({ message: 'Pré-jogo não encontrado' });
    }

    req.body.participantes = preJogo.participantes;
    req.body.data = preJogo.data;

    await PreJogo.remove({ _id: preJogo._id });

    return await jogoController.inserir(req, res);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.excluir = async (req, res) => {
  try {
    const preJogo = await PreJogo.findOne({});
    if (!preJogo) {
      return res.status(440).json({ message: 'Pré-jogo não encontrado' });
    }

    await PreJogo.remove({ _id: preJogo._id });

    return res.json({ message: 'Pré-jogo cancelado' });
  } catch (err) {
    return res.status(440).json(err);
  }
};

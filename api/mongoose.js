const mongoose = require('mongoose');
const Pontuacao = require('./models/pontuacao');
const Premiacao = require('./models/premiacao');
const Jogador = require('./models/jogador');
const Jogo = require('./models/jogo');
const Parametro = require('./models/parametro');
const LancamentoCaixa = require('./models/lancamentoCaixa');
const PreJogo = require('./models/preJogo');
const ClassificacaoEtapa = require('./models/classificacaoEtapa');
const Relogio = require('./models/relogio');
const EstruturaRelogio = require('./models/estruturaRelogio');
const Agendamento = require('./models/agendamento');
const Local = require('./models/local');

module.exports.connect = async () => {
  mongoose.Promise = global.Promise;

  //const uri = process.env.MONGODB_URI || `mongodb+srv://tqsop:tqsop2023@tqsop2023.bsp7s6t.mongodb.net/tqsop?retryWrites=true&w=majority`; //2023
  const uri = process.env.MONGODB_URI || `mongodb+srv://tqsop:tqsop2023@tqsop2023.bsp7s6t.mongodb.net/tqsop_test?retryWrites=true&w=majority`; //2023_test

  const mongooseOpts = {
    useNewUrlParser: true,

    // autoReconnect: true,
    // reconnectTries: Number.MAX_VALUE,
    // reconnectInterval: 1000
  };

  await mongoose.connect(uri, mongooseOpts);
};

module.exports.disconnect = async () => {
  await mongoose.disconnect();
}
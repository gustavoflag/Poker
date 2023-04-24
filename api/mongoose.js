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

module.exports.connect = async () => {
  mongoose.Promise = global.Promise;

  //mongodb+srv://heroku_b595dzsg:8qcrfj4oqhv4q8pkjs4iiv7nfm@cluster-b595dzsg.wqxdy.mongodb.net/heroku_b595dzsg //2018
  //mongodb+srv://heroku_1h8pfvcr:e5r69cvt2q9qfphibu5mjiej40@cluster-1h8pfvcr.rnhd2.mongodb.net/heroku_1h8pfvcr //2019
  //mongodb+srv://heroku_dvvkpq45:6a04qh41uh1tgvk0dcgl3mhl4j@cluster-dvvkpq45.togo7.mongodb.net/heroku_dvvkpq45 //2020
  //mongodb+srv://tqsop:tqsop2021@tqsop2021.sg513.mongodb.net/tqsop?retryWrites=true&w=majority //2021
  //mongodb+srv://tqsop:tqsop2022@tqsop2022.hdcd9.mongodb.net/tqsop?retryWrites=true&w=majority //2022

  //const uri = process.env.MONGODB_URI || `mongodb+srv://tqsop:tqsop2023@tqsop2023.bsp7s6t.mongodb.net/tqsop?retryWrites=true&w=majority`; //2023
  const uri = process.env.MONGODB_URI || `mongodb+srv://tqsop:tqsop2023@tqsop2023.bsp7s6t.mongodb.net/tqsop_test?retryWrites=true&w=majority`; //2023_test

  const mongooseOpts = {
    useNewUrlParser: true,
  };

  await mongoose.connect(uri, mongooseOpts);
};

module.exports.disconnect = async () => {
  await mongoose.disconnect();
}
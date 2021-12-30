const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();
const routes = require('./api/routes/pokerRoutes');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose'),
  Pontuacao = require('./api/models/pontuacao'),
  Premiacao = require('./api/models/premiacao'),
  Jogador = require('./api/models/jogador'),
  Jogo = require('./api/models/jogo'),
  Usuario = require('./api/models/usuario'),
  Parametro = require('./api/models/parametro'),
  LancamentoCaixa = require('./api/models/lancamentoCaixa'),
  PreJogo = require('./api/models/preJogo'),
  ClassificacaoEtapa = require('./api/models/classificacaoEtapa'),
  Relogio = require('./api/models/relogio'),
  EstruturaRelogio = require('./api/models/estruturaRelogio'),
  jsonwebtoken = require("jsonwebtoken"),
  bodyParser = require('body-parser');

const multer = require('multer');
var forms = multer();

mongoose.Promise = global.Promise;
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/poker'); //local
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_b595dzsg:8qcrfj4oqhv4q8pkjs4iiv7nfm@cluster-b595dzsg-shard-00-00.wqxdy.mongodb.net:27017,cluster-b595dzsg-shard-00-01.wqxdy.mongodb.net:27017,cluster-b595dzsg-shard-00-02.wqxdy.mongodb.net:27017/heroku_b595dzsg?ssl=true&replicaSet=atlas-131hw6-shard-0&authSource=admin&retryWrites=true&w=majority'); //2018 - Migrado
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_1h8pfvcr:e5r69cvt2q9qfphibu5mjiej40@cluster-1h8pfvcr-shard-00-00.rnhd2.mongodb.net:27017,cluster-1h8pfvcr-shard-00-01.rnhd2.mongodb.net:27017,cluster-1h8pfvcr-shard-00-02.rnhd2.mongodb.net:27017/heroku_1h8pfvcr?ssl=true&replicaSet=atlas-ag1wet-shard-0&authSource=admin&retryWrites=true&w=majority'); //2019 - Migrado
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_5lgwrn5j:6fq01flrm14o51em30nk9nibob@cluster-5lgwrn5j-shard-00-00.ayh0m.mongodb.net:27017,cluster-5lgwrn5j-shard-00-01.ayh0m.mongodb.net:27017,cluster-5lgwrn5j-shard-00-02.ayh0m.mongodb.net:27017/heroku_5lgwrn5j?ssl=true&replicaSet=atlas-b0oga1-shard-0&authSource=admin&retryWrites=true&w=majority'); //STG - Migrado
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_dvvkpq45:6a04qh41uh1tgvk0dcgl3mhl4j@cluster-dvvkpq45-shard-00-00.togo7.mongodb.net:27017,cluster-dvvkpq45-shard-00-01.togo7.mongodb.net:27017,cluster-dvvkpq45-shard-00-02.togo7.mongodb.net:27017/heroku_dvvkpq45?ssl=true&replicaSet=atlas-cl7yo6-shard-0&authSource=admin&retryWrites=true&w=majority'); //2020 - Migrado

//mongodb+srv://tqsop:tqsop2021@tqsop2021.sg513.mongodb.net/tqsop?retryWrites=true&w=majority //2021 - NOVO DRIVER
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://tqsop:tqsop2021@tqsop2021-shard-00-00.sg513.mongodb.net:27017,tqsop2021-shard-00-01.sg513.mongodb.net:27017,tqsop2021-shard-00-02.sg513.mongodb.net:27017/tqsop?ssl=true&replicaSet=atlas-14480s-shard-0&authSource=admin&retryWrites=true&w=majority'); //2021

//mongodb+srv://tqsop:tqsop2022@tqsop2022.hdcd9.mongodb.net/tqsop?retryWrites=true&w=majority //2022 - NOVO DRIVER
mongoose.connect(process.env.MONGODB_URI || 'mongodb://tqsop:tqsop2022@tqsop2022-shard-00-00.hdcd9.mongodb.net:27017,tqsop2022-shard-00-01.hdcd9.mongodb.net:27017,tqsop2022-shard-00-02.hdcd9.mongodb.net:27017/tqsop?ssl=true&replicaSet=atlas-11hibj-shard-0&authSource=admin&retryWrites=true&w=majority'); //2022

app.use(bodyParser.urlencoded({ extended: true }));
app.use(forms.array()); 
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT'){
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode){
      if (err)
        req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

/*SERVER*/
routes(router);
app.use('/.netlify/functions/server', router);
module.exports.handler = serverless(app);



/*LOCAL*/
// routes(app);
// app.listen(port);
// console.log('API iniciada, porta: ' + port);

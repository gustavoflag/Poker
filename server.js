var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Pontuacao = require('./api/models/pontuacao'),
  Premiacao = require('./api/models/premiacao'),
  Jogador = require('./api/models/jogador'),
  Jogo = require('./api/models/jogo'),
  jsonwebtoken = require("jsonwebtoken"),
  Usuario = require('./api/models/usuario'),
  Parametro = require('./api/models/parametro'),
  LancamentoCaixa = require('./api/models/lancamentoCaixa'),
  PreJogo = require('./api/models/preJogo'),
  ClassificacaoEtapa = require('./api/models/classificacaoEtapa'),
  bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/poker');
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_b595dzsg:8qcrfj4oqhv4q8pkjs4iiv7nfm@ds141657.mlab.com:41657/heroku_b595dzsg'); //2018
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_1h8pfvcr:e5r69cvt2q9qfphibu5mjiej40@ds141960.mlab.com:41960/heroku_1h8pfvcr'); //2019
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_dvvkpq45:6a04qh41uh1tgvk0dcgl3mhl4j@ds119578.mlab.com:19578/heroku_dvvkpq45'); //2020 - STG
mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_dvvkpq45:6a04qh41uh1tgvk0dcgl3mhl4j@ds119578.mlab.com:19578/heroku_dvvkpq45'); //2020
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/pokerRoutes');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
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

routes(app);

app.listen(port);

console.log('API iniciada, porta: ' + port);

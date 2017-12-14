var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Pontuacao = require('./api/models/pontuacao'),
  Jogador = require('./api/models/jogador'),
  Jogo = require('./api/models/jogo'),
  bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/poker');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/pokerRoutes');
routes(app);

app.listen(port);

console.log('API iniciada, porta: ' + port);

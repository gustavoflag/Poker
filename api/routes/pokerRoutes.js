'use strict';
module.exports = function(app) {
  var pontuacaoController = require('../controllers/pontuacaoController.js');
  var jogadorController = require('../controllers/jogadorController.js');
  var jogoController = require('../controllers/jogoController.js');

  app.route('/pontuacao')
    .get(pontuacaoController.listar)
    .post(pontuacaoController.inserir);

  app.route('/pontuacao/:pontuacaoId')
    .get(pontuacaoController.consultar)
    .put(pontuacaoController.alterar)
    .delete(pontuacaoController.excluir);

  app.route('/jogador')
    .get(jogadorController.listar)
    .post(jogadorController.inserir);

  app.route('/jogador/:jogadorId')
      .get(jogadorController.consultar)
      .put(jogadorController.alterar)
      .delete(jogadorController.excluir);

  app.route('/jogo')
    .get(jogoController.listar)
    .post(jogoController.inserir);

  app.route('/jogo/:jogoId')
      .get(jogoController.consultar)
      .put(jogoController.alterar)
      .delete(jogoController.excluir);

};

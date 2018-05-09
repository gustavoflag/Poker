'use strict';
module.exports = function(app) {
  var pontuacaoController = require('../controllers/pontuacaoController.js');
  var jogadorController = require('../controllers/jogadorController.js');
  var jogoController = require('../controllers/jogoController.js');
  var usuarioController = require('../controllers/usuarioController.js');
  var parametroController = require('../controllers/parametroController.js');
  var lancamentoCaixaController = require('../controllers/lancamentoCaixaController.js');

  app.route('/pontuacao')
    .get(pontuacaoController.listar)
    .post(usuarioController.loginRequerido, pontuacaoController.inserir);

  app.route('/pontuacao/:pontuacaoId')
    .get(pontuacaoController.consultar)
    .put(usuarioController.loginRequerido, pontuacaoController.alterar)
    .delete(usuarioController.loginRequerido, pontuacaoController.excluir);

  app.route('/jogador')
    .get(jogadorController.listar)
    .post(usuarioController.loginRequerido, jogadorController.inserir);

  app.route('/jogador/:jogadorId')
    .get(jogadorController.consultar)
    .put(usuarioController.loginRequerido, jogadorController.alterar)
    .delete(usuarioController.loginRequerido, jogadorController.excluir);

  app.route('/classificacao')
    .get(jogadorController.classificacao);

  app.route('/classificacaoMes/:ano/:mes')
    .get(jogadorController.classificacaoMes);

  app.route('/classificacaoTodosMeses')
    .get(jogadorController.classificacaoTodosMeses);

  app.route('/classificacaoRookies')
    .get(jogadorController.classificacaoRookies);

  app.route('/jogo')
    .get(jogoController.listar)
    .post(usuarioController.loginRequerido, jogoController.inserir);

  app.route('/jogo/:jogoId')
    .get(jogoController.consultar)
    .put(usuarioController.loginRequerido, jogoController.alterar)
    .delete(usuarioController.loginRequerido, jogoController.excluir);

  app.route('/quantidadeJogos')
    .get(jogoController.quantidade);

  app.route('/auth/cadastrar')
    .post(usuarioController.loginRequerido, usuarioController.inserir);

  app.route('/auth/login')
    .post(usuarioController.login);

  app.route('/parametro')
    .get(parametroController.consultar)
    .put(usuarioController.loginRequerido, parametroController.alterar);

  app.route('/lancamentoCaixa')
    .get(lancamentoCaixaController.listar)
    .post(usuarioController.loginRequerido, lancamentoCaixaController.inserir);

  app.route('/lancamentoCaixa/:lancamentoCaixaId')
    .get(lancamentoCaixaController.consultar)
    .put(usuarioController.loginRequerido, lancamentoCaixaController.alterar)
    .delete(usuarioController.loginRequerido, lancamentoCaixaController.excluir);

};

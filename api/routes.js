'use strict';
module.exports = (app) => {
  const pontuacaoController = require('./controllers/pontuacaoController.js');
  const premiacaoController = require('./controllers/premiacaoController.js');
  const jogadorController = require('./controllers/jogadorController.js');
  const jogoController = require('./controllers/jogoController.js');
  const authGuard = require('./guards/authGuard.js');
  const parametroController = require('./controllers/parametroController.js');
  const lancamentoCaixaController = require('./controllers/lancamentoCaixaController.js');
  const preJogoController = require('./controllers/preJogoController.js');
  const agendamentoController = require('./controllers/agendamentoController.js');
  const localController = require('./controllers/localController.js')

  app.route('/pontuacao')
    .get(pontuacaoController.listar)
    .post(authGuard.isAuthenticated, pontuacaoController.inserir);

  app.route('/pontuacao/inserirLote')
    //.post(pontuacaoController.inserirLote)
    .post(authGuard.isAuthenticated, pontuacaoController.inserirLote);

  app.route('/pontuacao/:pontuacaoId')
    .get(pontuacaoController.consultar)
    .put(authGuard.isAuthenticated, pontuacaoController.alterar)
    .delete(authGuard.isAuthenticated, pontuacaoController.excluir);

  app.route('/premiacao')
    .get(premiacaoController.listar)
    .post(authGuard.isAuthenticated, premiacaoController.inserir);

  app.route('/premiacao/:premiacaoId')
    .get(pontuacaoController.consultar)
    .put(authGuard.isAuthenticated, premiacaoController.alterar)
    .delete(authGuard.isAuthenticated, premiacaoController.excluir);

  app.route('/premiacao/inserirLote')
    //.post(premiacaoController.inserirLote);
    .post(authGuard.isAuthenticated, premiacaoController.inserirLote);

  app.route('/jogador')
    .get(jogadorController.listar)
    .post(authGuard.isAuthenticated, jogadorController.inserir);

  app.route('/jogador/inserirLote')
    //.post(jogadorController.inserirLote);
    .post(authGuard.isAuthenticated, jogadorController.inserirLote);

  app.route('/jogador/exportar')
    .get(jogadorController.exportar);

  app.route('/jogador/:jogadorId')
    .get(jogadorController.consultar)
    .put(authGuard.isAuthenticated, jogadorController.alterar)
    .delete(authGuard.isAuthenticated, jogadorController.excluir);
  
  app.route('/jogador/porNome/:nomeJogador')
    .get(jogadorController.consultarPorNome);
  
  // app.route('/jogador/excluirPontuacaoEtapas')
  //   .post(jogadorController.excluirPontuacaoEtapas);

  app.route('/classificacao')
    .get(jogadorController.classificacao);

  app.route('/classificacao/:ordem')
    .get(jogadorController.classificacao);

  app.route('/classificacaoMes/:ano/:mes')
    .get(jogadorController.classificacaoMes);

  app.route('/classificacaoEtapa/:etapa')
    .get(jogadorController.classificacaoEtapa);

  app.route('/classificacaoEtapa')
   .get(jogadorController.listarClassificacaoTodasEtapas);

  // app.route('/gerarClassificacaoEtapas')
  //    .get(jogadorController.classificacaoTodasEtapas);

  // app.route('/classificacaoJogadorEtapa')
  //  .get(jogadorController.classificacaoJogadorEtapa);

  app.route('/classificacaoTodosMeses/:ano')
    .get(jogadorController.classificacaoTodosMeses);

  app.route('/classificacaoTodosMeses')
    .get(jogadorController.classificacaoTodosMeses);

  app.route('/classificacaoRookies')
    .get(jogadorController.classificacaoRookies);

  app.route('/classificacaoRookies/:ordem')
    .get(jogadorController.classificacaoRookies);

  app.route('/jogo')
    .get(jogoController.listar)
    .post(authGuard.isAuthenticated, jogoController.inserir);

  app.route('/jogoDireto')
    .post(authGuard.isAuthenticated, jogoController.inserirDireto);

  app.route('/jogo/:jogoId')
    .get(jogoController.consultar)
    .put(authGuard.isAuthenticated, jogoController.alterar)
    .delete(authGuard.isAuthenticated, jogoController.excluir);

  app.route('/quantidadeJogos')
    .get(jogoController.quantidade);

  app.route('/parametro')
    .get(parametroController.consultar)
    .put(authGuard.isAuthenticated, parametroController.alterar);

  app.route('/tema')
    .get(parametroController.tema);

  app.route('/saldoCaixa/:contaId')
    .get(lancamentoCaixaController.saldo)

  app.route('/lancamentoCaixa')
    .post(authGuard.isAuthenticated, lancamentoCaixaController.inserir);

  app.route('/lancamentoCaixa/conta/:contaId')
    .get(lancamentoCaixaController.listar);

  app.route('/lancamentoCaixa/:lancamentoCaixaId')
    .get(lancamentoCaixaController.consultar)
    .put(authGuard.isAuthenticated, lancamentoCaixaController.alterar)
    .delete(authGuard.isAuthenticated, lancamentoCaixaController.excluir);

  app.route('/preJogo')
    .get(preJogoController.consultar)
    .put(authGuard.isAuthenticated, preJogoController.alterarJogador)
    .post(authGuard.isAuthenticated, preJogoController.inserir)
    .delete(authGuard.isAuthenticated, preJogoController.excluir);

  app.route('/preJogo/gerarJogo')
    .post(authGuard.isAuthenticated, preJogoController.gerarJogo);

  app.route('/preJogo/sortear')
    .post(authGuard.isAuthenticated, preJogoController.sortear);

  app.route('/preJogo/adicionarJogador')
    .post(authGuard.isAuthenticated, preJogoController.adicionarJogador);

  app.route('/preJogo/excluirJogador')
    .post(authGuard.isAuthenticated, preJogoController.excluirJogador);

  app.route('/preJogo/alterarDealer')
    .post(authGuard.isAuthenticated, preJogoController.alterarDealer);

  app.route('/local')
    .get(localController.listar)
    .post(authGuard.isAuthenticated, localController.inserir);

  app.route('/local/:localId')
    .get(localController.consultar)
    .put(authGuard.isAuthenticated, localController.alterar)
    .delete(authGuard.isAuthenticated, localController.excluir);

  app.route('/agendamento')
    .get(agendamentoController.listar)
    .post(authGuard.isAuthenticated, agendamentoController.inserir);

  app.route('/agendamento/:agendamentoId')
    .get(agendamentoController.consultar)
    .put(authGuard.isAuthenticated, agendamentoController.alterar)
    .delete(authGuard.isAuthenticated, agendamentoController.excluir);

  app.route('/proximosAgendamentos')
    .get(agendamentoController.listarProximos);

  app.route('/proximosAgendamentos/:qtd')
    .get(agendamentoController.listarProximos);

  app.route('/todosAgendamentos/:ano')
    //.post(agendamentoController.inserirAnoTodo);
    .post(authGuard.isAuthenticated, agendamentoController.inserirAnoTodo);
};

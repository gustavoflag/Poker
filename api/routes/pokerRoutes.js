'use strict';
module.exports = function(app) {
  var pontuacaoController = require('../controllers/pontuacaoController.js');

  // todoList Routes
  app.route('/pontuacao')
    .get(pontuacaoController.listar)
    .post(pontuacaoController.inserir);

  /*app.route('/tasks/:taskId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);*/
};

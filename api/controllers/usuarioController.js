'use strict';

var mongoose = require('mongoose'),
Usuario = mongoose.model('Usuario'),
bcrypt = require('bcrypt-nodejs'),
Retorno = require('../models/retorno.js'),
jwt = require('jsonwebtoken');

exports.inserir = function(req, res) {
  var novoUsuario = new Usuario(req.body);
  var salt = bcrypt.genSaltSync(10);
  novoUsuario.senha = bcrypt.hashSync(req.body.senha, salt);
  novoUsuario.save(function(err, user) {
    if (err) {
      return res.status(400).json({
        message: err
      });
    } else {
      user.senha = undefined;
      return res.json(user);
    }
  });
};

exports.login = function(req, res) {
  Usuario.findOne({
    login: req.body.login
  }, function(err, user) {
    if (err)
      return res.status(400).json(err);
    if (!user) {
      return res.status(401).json({ message: 'Falha na autenticação. Usuário não encontrado.' });
    } else if (user) {
      if (!user.compararSenha(req.body.senha)) {
        return res.status(401).json({ message: 'Falha na autenticação. Senha não confere.' });
      } else {
        return res.json({ message: 'Usuário autenticado', token: jwt.sign({ login: user.login, _id: user._id }, 'RESTFULAPIs', { expiresIn: 86400 })});
      }
    }
  });
};

exports.loginRequerido = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Usuário não autorizado.' });
  }
};

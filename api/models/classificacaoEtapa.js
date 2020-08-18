'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClassificacaoEtapaSchema = new Schema({
    etapa: {
        type: Number,
        required: 'Etapa é obrigatória!',
        unique: true
    },
    classificacao: {
        type: [{
            nomeJogador: {
                type: String,
                required: 'Nome é obrigatório!'
            },
            pontos:{
                type: Number,
                default: 0
            }
        }]
    }
});

module.exports = mongoose.model('ClassificacaoEtapa', ClassificacaoEtapaSchema);

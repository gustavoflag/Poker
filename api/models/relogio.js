'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RelogioSchema = new Schema({
    inicioRelogio: {
        type: Number
    },
    segundos: {
        type: Number
    },
    estrutura: {
        type: [{
            nivel:{
                type: Number
            },
            segs:{
                type: Number
            },
            sb:{
                type: Number
            },
            bb: {
                type: Number
            },
            ante: {
                type: Number
            },
            msg: {
                type: String
            },
            segsInicio: {
                type: Number
            },
            segsFim: {
                type: Number
            }
        }],
        required: true
    },
});

module.exports = mongoose.model('Relogio', RelogioSchema);

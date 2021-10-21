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
    status: {
        type: String
    }
});

module.exports = mongoose.model('Relogio', RelogioSchema);

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var estruturaRelogioSchema = new Schema({
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
});

module.exports = mongoose.model('EstruturaRelogio', estruturaRelogioSchema);
var mongoose = require('mongoose'),
Relogio = mongoose.model('Relogio');

var inicioRelogio = null;
var segundos = 0;
var estrutura;

exports.consultar = async function(req, res) {
    try {
        const relogio = await Relogio.findOne({ });
        return res.json(relogio);
    } catch (err) {
        return res.status(440).json(err);
    }
};

exports.alterar = async function(req, res) {
    try {
        var relogio = await Relogio.findOne({ });

        if (relogio){
            relogio = await Relogio.findOneAndUpdate({ }, req.body, {new: true});
            return res.json(relogio);
        } else {
            var novoRelogio = new Relogio(req.body);
            await novoRelogio.save();
            return res.json(novoRelogio);
        }
    } catch (err) {
        console.log('err', err)
        return res.status(440).json(err);
    }
};

exports.iniciar = async function(req, res){
    if (!inicioRelogio){

        if (!estrutura){
            var relogio = await Relogio.findOne({ });
            if (relogio){
                estrutura = relogio.estrutura;
            } else {
                return res.status(440).json({ message: 'Estrutura do relógio não encontrada' });
            }
        }

        if (!estrutura[0].segsInicio){
            segsInicio = 0;

            estrutura.forEach(nivel => {
                nivel.segsInicio = segsInicio + 1;
                nivel.segsFim = segsInicio + nivel.segs;
                segsInicio = nivel.segsFim;
            });
        }

        inicioRelogio = Math.floor(Date.now() / 1000);
    } 

    return res.json({ status: 'INICIADO', inicio: inicioRelogio, segundos: segundos });
}

exports.parar = function(req, res){
    if (inicioRelogio){
        var agora = Math.floor(Date.now() / 1000);
        var span_secs = (agora - inicioRelogio);
        inicioRelogio = null;
        segundos += span_secs;
    }

    return res.json({ status: 'PARADO', inicio: null, segundos: segundos });
}

exports.reiniciar = function(req, res){
    inicioRelogio = null;
    segundos = 0;
    return res.json({ status: 'PARADO', inicio: inicioRelogio, segundos: segundos });
}

exports.voltar = function(req, res){
    var relogioAtual = getRelogioAtual();
    if (relogioAtual.nivel){
        inicioRelogio = Math.floor(Date.now() / 1000);
        segundos = relogioAtual.nivel.segsInicio;
    }

    return res.json({ status: (inicioRelogio ? 'INICIADO' : 'PARADO'), inicio: inicioRelogio, segundos: segundos });
}

exports.avancar = function(req, res){
    var relogioAtual = getRelogioAtual();
    if (relogioAtual.nivel){
        inicioRelogio = Math.floor(Date.now() / 1000);
        segundos = relogioAtual.nivel.segsFim + 1;
    }

    return res.json({ status: (inicioRelogio ? 'INICIADO' : 'PARADO'), inicio: inicioRelogio, segundos: segundos });
}

exports.getRelogio = function(req, res){
    return res.json(getRelogioAtual());
}

function getNivel(segs){
    let nivelAtual;

    if (estrutura){
        estrutura.every(nivel => {
            if (nivel.segsFim < segs){
                return true;
            } else {
                nivelAtual = nivel;
                return false
            }
        });
    }

    return nivelAtual;
}

function getRelogioAtual(){
    var nivelAtual;
    var secsAtual;
    var curr_secs;
    var elapsed_secs;
    if (inicioRelogio){
        var agora = Math.floor(Date.now() / 1000);
        var span_secs = (agora - inicioRelogio);

        secsAtual = span_secs + segundos;
    } else {
        secsAtual = segundos;
    } 

    nivelAtual = getNivel(secsAtual);
    if (nivelAtual){
        elapsed_secs = (secsAtual - nivelAtual.segsInicio + 1);

        curr_secs = nivelAtual.segs - elapsed_secs;

        return { nivel: nivelAtual, secs: curr_secs, secs_pass: elapsed_secs };
    } else {
        if (inicioRelogio){
            return { msg: "Relógio encerrado" };
        } else {
            inicioRelogio = null;
            segundos = 0;
            return { status: 'PARADO', inicio: inicioRelogio, segundos: segundos };
        }
        
    }
}
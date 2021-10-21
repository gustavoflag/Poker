var mongoose = require('mongoose'),
Relogio = mongoose.model('Relogio');

exports.consultar = async function(req, res) {
    try {
        var relogio = await Relogio.findOne({ }).lean();

        return res.json(relogio);
    } catch (err) {
        return res.status(440).json(err);
    }
};

exports.iniciar = async function(req, res){
    try {
        var relogio = await Relogio.findOne({ });

        if (relogio){
            var body = {
                inicioRelogio: Math.floor(Date.now() / 1000),
                segundos: relogio.segundos,
                status: "INICIADO"
            };

            relogio = await Relogio.findOneAndUpdate({ }, body, {new: true});
            return res.json(relogio);
        } else {
            var body = {
                inicioRelogio: Math.floor(Date.now() / 1000),
                segundos: 0,
                status: "INICIADO"
            };

            var novoRelogio = new Relogio(body);
            await novoRelogio.save();
            return res.json(novoRelogio);
        }
    } catch (err) {
        return res.status(440).json(err);
    }
}

exports.parar = async function(req, res){
    try {
        var relogio = await Relogio.findOne({ });
        if (relogio && relogio.inicioRelogio){
            var agora = Math.floor(Date.now() / 1000);
            var span_secs = (agora - relogio.inicioRelogio);

            var body = {
                inicioRelogio: null,
                segundos: relogio.segundos + span_secs,
                status: "PARADO"
            };

            relogio = await Relogio.findOneAndUpdate({ }, body, {new: true});
            return res.json(relogio);
        } else {
            return res.status(440).json({ message: 'Relógio não encontrado ou não iniciado' });
        }
    } catch (err) {
        return res.status(440).json(err);
    }
}

exports.reiniciar = async function(req, res){
    try {
        var relogio = await Relogio.findOne({ });

        var body = {
            inicioRelogio: null,
            segundos: 0,
            status: "PARADO"
        };

        if (relogio){
            relogio = await Relogio.findOneAndUpdate({ }, body, {new: true});
            return res.json(relogio);
        } else {
            var novoRelogio = new Relogio(body);
            await novoRelogio.save();
            return res.json(novoRelogio);
        }
    } catch (err) {
        return res.status(440).json(err);
    }
}

exports.voltar = async function(req, res){
    try {
        var relogio = await Relogio.findOne({ });
        if (relogio){
            var agora = Math.floor(Date.now() / 1000);

            var body = {
                inicioRelogio: (relogio.inicioRelogio ? agora : null),
                segundos: req.body.nivelBlind.segsInicio,
                status: relogio.status
            };

            relogio = await Relogio.findOneAndUpdate({ }, body, {new: true});
            return res.json(relogio);
        } else {
            return res.status(440).json({ message: 'Relógio não encontrado' });
        }
    } catch (err) {
        return res.status(440).json(err);
    }
}

exports.avancar = async function(req, res){
    try {
        var relogio = await Relogio.findOne({ });
        if (relogio){
            var agora = Math.floor(Date.now() / 1000);

            var body = {
                inicioRelogio: (relogio.inicioRelogio ? agora : null),
                segundos: req.body.nivelBlind.segsFim + 1,
                status: relogio.status
            };

            relogio = await Relogio.findOneAndUpdate({ }, body, {new: true});
            return res.json(relogio);
        } else {
            return res.status(440).json({ message: 'Relógio não encontrado' });
        }
    } catch (err) {
        return res.status(440).json(err);
    }
}
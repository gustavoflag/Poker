var mongoose = require('mongoose'),
EstruturaRelogio = mongoose.model('EstruturaRelogio');

exports.listar = async function(req, res) {
    try {
        const estrutura = await EstruturaRelogio.find({ });

        return res.json(estrutura);
    } catch (err) {
        return res.status(440).json(err);
    }
};

exports.alteraTodos = async function(req, res) {
    if (req.body){
        try {
            segsInicio = 0;
            req.body.forEach(nivel => {
                nivel.segsInicio = (segsInicio > 0 ? segsInicio + 1 : segsInicio);
                nivel.segsFim = segsInicio + nivel.segs;
                segsInicio = nivel.segsFim;
            });
    
            await EstruturaRelogio.deleteMany({ });
            const estrutura = await EstruturaRelogio.insertMany(req.body);
    
            return res.json(estrutura);
            
        } catch (err) {
            console.log('err', err)
            return res.status(440).json(err);
        } 
    } else {
        return res.status(440).json({ message: 'Payload deve ser um array' });
    }
};
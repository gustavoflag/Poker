'use strict';
exports.isAuthenticated = function(req, res, next) {
    if (req.user && req.user.appName == 'tqsop') {
        next();
    } else {
        return res.status(401).json({ message: 'Usuário não autorizado.' });
    }
};
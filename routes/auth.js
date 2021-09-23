const jwt = require('express-jwt');
const secret = require('../config').secret;

// Recuperamos el token (si es que lo hay) aunque sea Bearer
function getTokenFromHeader(req) {
    if (req.headers.authorization && (req.headers.authorization.split(' ')[0] === 'Token' || req.headers.authorization.split(' ')[0] === 'Bearer')) {
        return req.headers.authorization.split(' ')[1];
    }
}

// Definimos dos formas de autenticación. En una es necesario un token y la otra no
const auth = {
    requerido: jwt({
        secret: secret,
        algorithms: ['HS256'],
        userProperty: 'usuario', // Esto se verá como req.usuario
        getToken: getTokenFromHeader
    }),
    opcional: jwt({
        secret: secret,
        algorithms: ['HS256'],
        userProperty: 'usuario',
        credentialsRequired: false,
        getToken: getTokenFromHeader
    })
}

module.exports = auth;
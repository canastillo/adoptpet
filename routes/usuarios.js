const router = require('express').Router();

const {
    crearUsuario,
    obtenerUsuario,
    modificarUsuario,
    eliminarUsuario,
    iniciarSesion
} = require('../controllers/usuarios');

const auth = require('./auth');

router.get('/', auth.requerido, obtenerUsuario);
router.get('/:id', auth.requerido, obtenerUsuario);
router.post('/', crearUsuario); // El usuario aún no existe; no tiene sentido autenticarse
router.post('/entrar', iniciarSesion); // El login debe ser post, no porque se cree algo, sino porque se envía información
router.put('/:id', auth.requerido, modificarUsuario);
router.delete('/:id', auth.requerido, eliminarUsuario);

module.exports = router;

const router = require('express').Router();

const {
    crearMascota,
    obtenerMascota,
    modificarMascota,
    eliminarMascota,
    contar
} = require('../controllers/mascotas');

// El orden de las rutas importa!!!
router.get('/', obtenerMascota);
router.get('/contar/:categoria', contar)
router.get('/:id', obtenerMascota);
router.post('/', crearMascota);
router.put('/:id', modificarMascota);
router.delete('/:id', eliminarMascota);

module.exports = router
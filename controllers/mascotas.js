const mongoose = require('mongoose')
const Mascota = mongoose.model('Mascota')

function crearMascota(req, res, next) {
    let mascota = new Mascota(req.body);

    mascota.save().then(document => {
        res.status(200).send(document)
    }).catch(next)
}

function obtenerMascota(req, res, next) {
    if (req.params.id) {
        Mascota.findById(req.params.id)
        .then(doc => {res.send(doc)})
        .catch(next)
    } else {
        Mascota.find()
        .then(collection => {res.send(collection)})
        .catch(next)
    }
}

function modificarMascota(req, res, next) {
    Mascota.findById(req.params.id)
    .then(mascota => {
        // Si no encuentra la mascota, no lo capta como un error (porque la búsqueda fue correcta)
        if(!mascota) { return res.sendStatus(404) }

        let nuevosDatos = req.body

        if (typeof nuevosDatos.nombre !== undefined) {
            mascota.nombre = nuevosDatos.nombre
        }
        if (typeof nuevosDatos.nombre !== undefined) {
            mascota.foto = nuevosDatos.foto
        }
        if (typeof nuevosDatos.nombre !== undefined) {
            mascota.descripcion = nuevosDatos.descripcion
        }
        if (typeof nuevosDatos.nombre !== undefined) {
            mascota.ubicacion = nuevosDatos.ubicacion
        }

        mascota.save()
        .then(actualizado => {
            res.status(200).json(actualizado.publicData())
        })
        .catch(next)
    })
    .catch(next)
}

function eliminarMascota(req, res, next) {
    Mascota.findOneAndDelete({_id: req.params.id})
    .then(r => {res.status(200).send("La mascota se eliminó.")})
    .catch(next)
}

function contar(req, res, next) {
    let categoria = req.params.categoria

    Mascota.aggregate([
        {'$match': {'categoria': categoria}},
        {'$count': 'total'}
    ]).then(r => {
        console.log(r);
        res.status(200).send(r)
    })
    .catch(next)
}

module.exports = {
    crearMascota,
    obtenerMascota,
    modificarMascota,
    eliminarMascota,
    contar
}
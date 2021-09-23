const mongoose = require('mongoose')
const Solicitud = mongoose.model('Solicitud')

function crearSolicitud(req, res) {
    let solicitud = new Solicitud(req.body);

    solicitud.save().then(document => {
        res.status(200).send(document)
    }).catch(next)
}

function obtenerSolicitud(req, res) {
    if (req.params.id) {
        Solicitud.findById(req.params.id)
        .then(doc => {res.send(doc)})
        .catch(next)
    } else {
        Solicitud.find()
        .then(collection => {res.send(collection)})
        .catch(next)
    }
}

function modificarSolicitud(req, res) {
    Solicitud.findById(req.params.id)
    .then(solicitud => {
        if(!solicitud) { return res.sendStatus(404) }

        let nuevosDatos = req.body
        
        if (typeof nuevosDatos.estado !== undefined) {
            solicitud.estado = nuevosDatos.estado
        }

        solicitud.save()
        .then(actualizado => {
            res.status(200).json(actualizado.publicData())
        })
        .catch(next)
    })
    .catch(next)
}

function eliminarSolicitud(req, res) {
    Solicitud.findOneAndDelete({_id: req.params.id})
    .then(r => {res.status(200).send("La solicitud se eliminó se eliminó.")})
    .catch(next)
}

function contarSolicitudesPorMascota(req, res, next) {
    let idMascota = req.params.idMascota

    Mascota.aggregate([
        {'$match': {'idMascota': idMascota}},
        {'$count': 'total'}
    ]).then(r => {
        console.log(r);
        res.status(200).send(r)
    })
    .catch(next)
}

module.exports = {
    crearSolicitud,
    obtenerSolicitud,
    modificarSolicitud,
    eliminarSolicitud,
    contarSolicitudesPorMascota
}


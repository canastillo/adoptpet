const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const passport = require('passport');

function crearUsuario(req, res, next) {
    const body = req.body, password = body.password;

    delete body.password

    const user = new Usuario(body)
    user.crearPassword(password);
    user.save()
        .then(user => { // Con toAuthJSON creamos el token de autenticación
            return res.status(200).json(user.toAuthJSON())
        })
        .catch(next)
}

function obtenerUsuario(req, res, next) {
    // Esta función requiere autenticación, por lo que
    // sí o sí, hay un usuario del que podemos obtener información
    Usuario.findById(req.usuario.id)
        .then( u => {
            // No encontramos usuario, por lo que no hay nada que mandar, 
            // pero al ser este método un GET, sí o sí espera una respuesta, 
            // así que con sendStatus evitamos devolver una respuesta vacía 
            // (sólo hay un status así que eso se manda)
            if(!user) {
                return sendStatus(401)
            }

            return res.json(user.publicData())
        })
        .catch(next)
}

function modificarUsuario(req, res, next) {
    // Sólo puedes modificarte a ti mismo
    Usuario.findById(req.usuario.id).then(user => {

        if (!user) { return res.sendStatus(401); }
        let nuevaInfo = req.body

        if (typeof nuevaInfo.username !== 'undefined')
          user.username = nuevaInfo.username

        if (typeof nuevaInfo.bio !== 'undefined')
          user.bio = nuevaInfo.bio

        if (typeof nuevaInfo.foto !== 'undefined')
          user.foto = nuevaInfo.foto

        if (typeof nuevaInfo.ubicacion !== 'undefined')
          user.ubicacion = nuevaInfo.ubicacion

        if (typeof nuevaInfo.telefono !== 'undefined')
          user.telefono = nuevaInfo.telefono

        if (typeof nuevaInfo.password !== 'undefined')
          user.crearPassword(nuevaInfo.password) // Volvemos a encriptar

        user.save().then(updatedUser => {
          res.status(201).json(updatedUser.publicData())
        }).catch(next)

    }).catch(next)
}

function eliminarUsuario(req, res, next) {
    // Sólo puedes eliminar tu propia cuenta
    Usuario.findOneAndDelete({_id: req.usuario.id})
        .then( r => res.status(200).send("Usuario eliminado"))
        .catch(next)
}

function iniciarSesion(req, res, next) {
    // No hay forma en que podamos iniciar sesión si falta el email o la contraseña
    if (!req.body.email || !req.body.password) {
        return res.status(422).json({error: {email: "Falta información"}})
    }

    // Passport es como una relación entre los usuarios y sus JWT
    passport.authenticate('local',
        { session: false },
        // Los parámetros de esta función, son resultado de authenticate
        // Es decir, esto es un callback
        function (err, user, info) {
            if (err) { return next(err) }

            if (user) { // Esto no es un usuario de la BD, es un usuario de passport (no modifica la BD)
                user.token = user.generateJWT(); // Cada que generamos un token nuevo, caduca el anterior (?)
            } else {
                return res.status(422).json(info)
            }
        }
    )(req, res, next) // authenticate regresa una función, acá la ejecutamos
}

module.exports = {
    crearUsuario,
    obtenerUsuario,
    modificarUsuario,
    eliminarUsuario,
    iniciarSesion
}
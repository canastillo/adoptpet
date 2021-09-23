const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const secret = require('../config').secret

const UsuarioSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "El campo username no puede estar vacío"],
        lowercase: true,
        match: [/^[a-z0-9]+$/i, "Username inválido"]
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El email no puede estar vacío"],
        match: [/\S+@\S+.\S+/, "Email inválido"],
        index: true // Indexamos por email para optimizar las búsquedas (haremos muchas búsquedas por email)
    },
    tipo: {
        type: String,
        enum: ['normal', 'anunciante']
    },
    // La contraseña ya no será un campo como tal, sino que se cifrará con estos dos valores
    hash: String, // Es la contraseña cifrada
    salt: String
}, {collection: "Usuarios", timestamps: true})

UsuarioSchema.plugin(uniqueValidator, {message: "Este registro ya existe"})

UsuarioSchema.methods.publicData = function() {
    return {
        id: this.id,
        username: this.username,
        nombre: this.nombre,
        apellido: this.apellido,
        email: this.email,
        tipo: this.tipo
    }
}

UsuarioSchema.methods.crearPassword = function(password) {
    // Definimos aleatoriamente un número hexadecimal. Es la semilla para el cifrado
    this.salt = crypto.randomBytes(16).toString('hex');
    // Indicamos el número de iteraciones, el tamaño de la cadena y el algoritmo de cifrado
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

UsuarioSchema.methods.validarPassword = function(password) {
    const newHash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
    return this.hash === newHash
}

// Nosotros generamos el token
UsuarioSchema.methods.generarJWT = function() {
    const today = new Date();
    const exp = new Date(today);

    exp.setDate(today.getDate() + 60) // El token expira en 60 días

    // Acá se genera la cadena alfanumérica que es el token
    console.log("Sólo falta firmarlo");
    return jwt.sign({
        id: this._id, // El campo lleva _ porque así lo guarda Mongo en la BD
        username: this.username,
        exp: parseInt(exp.getTime() / 1000)
    }, secret)
}

// JSON de respuesta al usuario cada que inicia sesión
UsuarioSchema.methods.toAuthJSON = function() {
    return {
        username: this.username,
        email: this.email,
        token: this.generarJWT()
    }
}

mongoose.model('Usuario', UsuarioSchema)

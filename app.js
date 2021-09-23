let isProduction = process.env.NODE_ENV === 'production';

// Importamos express y creamos un objeto express
const express = require('express')
const app = express()

// Parseamos responses
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Configuración de la BD
const mongoose = require('mongoose');

mongoose.connect(
    process.env.MONGO_URI,
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
)

mongoose.set("debug", true)

// Los modelos deben estar importados antes que passport, porque en passport importamos Usuario
require('./models/Usuario')
require('./models/Mascota')
require('./models/Solicitud')

require('./config/passport')

// Rutas
app.use('/v1', require('./routes'));

// Iniciando el servidor...
var server = app.listen(process.env.PORT || 3000, function () {
    console.log('Escuchando en el puerto ' + server.address().port);
  });
// Importamos express y creamos un objeto express
const express = require('express')
const app = express()

// Parseamos responses
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Configuración de la BD
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
mongoose.set("debug", true)

// Los modelos deben estar importados antes que passport, porque en passport importamos Usuario
require('./models/Usuario')
require('./models/Mascota')
require('./models/Solicitud')

require('./config/passport')


// Rutas
app.use('/v1', require('./routes'));

// Escucha en el puerto indicado
const PORT = 4001 // 3000 es el default
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

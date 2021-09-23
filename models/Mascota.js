const mongoose = require('mongoose')

const MascotaSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    categoria: {type: String, enum: ['Perro', 'Gato', 'Otro']},
    foto: String,
    descripcion: {type: String, required: true},
    anunciante: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'},
    ubicacion: String,
    estado: {type: String, enum: ['adoptado', 'disponible', 'pendiente']}
}, {timestamps: true, collection: 'Mascotas'})

MascotaSchema.methods.publicData = function() {
    return {
        nombre: this.nombre,
        categoria: this.categoria,
        foto: this.foto,
        descripcion: this.descripcion,
        anunciante: this.anunciante,
        ubicacion: this.ubicacion
    }
}

mongoose.model('Mascota', MascotaSchema)

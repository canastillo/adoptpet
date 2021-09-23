const mongoose = require('mongoose')

const SolicitudSchema = new mongoose.Schema({
    idMascota: { type: mongoose.Schema.Types.ObjectId, ref: 'Mascota' },
    idUsuarioAnunciante: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    idUsuarioSolicitante: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    estado: { type: String, enum: ['aceptado', 'pendiente', 'rechazado'] }
}, { timestamps: true, ref: 'Solicitud' })

SolicitudSchema.methods.publicData = function() {
    return {
        id: this.id,
        idMascota: this.idMascota,
        fechaDeCreacion: this.fechaDeCreacion,
        idUsuarioAnunciante: this.idUsuarioAnunciante,
        idUsuarioSolicitante: this.idUsuarioSolicitante,
        estado: this.estado
    }
}

mongoose.model('Solicitud', SolicitudSchema)
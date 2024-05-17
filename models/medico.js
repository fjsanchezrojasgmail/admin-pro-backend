
const { Schema, model } = require('mongoose');

const MedicoSchema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
    },
    google: {
        type: Boolean,
        default: false,
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref:'Usuario',
    },
    hospital: {
        required: true,
        type: Schema.Types.ObjectId,
        ref:'Hospital',
    },
    nombreHospital: {
        type: String,
        default:'Nombre Hospital',
    }
    
})

MedicoSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;

    return object;
})

module.exports = model('Medico', MedicoSchema);
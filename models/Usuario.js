const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    name: {
        type: String,
        require: true
    },
    phone:{
        type: String,
        require: true
    },
    address:{
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    cart: {
        type: Array
    }

})

UsuarioSchema.method('toJSON', function () {
    const {__v, _id, ...object } = this.toObject();
    object.id = _id;
    return object
})
module.exports = model('Usuario', UsuarioSchema)
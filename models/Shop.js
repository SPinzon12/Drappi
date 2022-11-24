const { Schema, model } = require('mongoose');

const ShopSchema = Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    address:{
        type: String,
        require: true
    },
    name: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    img: {
        type: String
    },
    star:{
        type: Number
    },
    delivery: {
        type: String
    },
    time: {
        type: String
    },
    products : []
})

ShopSchema.method('toJSON', function () {
    const {__v, _id, ...object } = this.toObject();
    object.id = _id;
    return object
})
module.exports = model('Shop', ShopSchema)
const { Schema, model } = require('mongoose');

const TaskSchema = Schema({
    title: {
        type: String,
        require: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})

TaskSchema.method('toJSON', function () {
    const {__v, _id, ...object } = this.toObject();
    object.id = id;
    return object
})
module.exports = model('Task', TaskSchema)
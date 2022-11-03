const express = require('express');
const Task = require('../models/Task');

const crearTask = async (req, res = express.request) => {
    const task = new Task(req.body);

    try {
        task.user = req.uid;
        const saved = await task.save();
        res.json({
            ok:true,
            task: saved
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            task: 'Internal error'
        })
    }
}


const listarTasks = async (req, res = express.request) => {
    const tasks = await Task.find()
                                .populate('user','name');
    try {
        res.status(200).json({
            ok: true,
            tasks,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}

const actualizarTask = async (req, res = express.request) => {
    

}

const eliminarrTask = async (req, res = express.request) => {

}

module.exports = {
    crearTask,
    listarTasks,
}
const express = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = express.request ) => {
   const { name, email, password } = req.body;
   try {
        let usuario = await Usuario.findOne({email:email})
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario con ese correo ya existe'
            })
        }

        usuario = new Usuario(req.body);
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password,salt);
        await usuario.save();

        res.status(200).json({
            ok: true,
            usuario,
           }); 
   } catch (err){
        console.log(err);
        res.status(500).json({
            ok: false,
            err
        })
   }

   
}

const loginUsuario = async (req, res = express.request ) => {
    const { name, email, password } = req.body;
    
    try {
        let usuario = await Usuario.findOne({email:email})
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            })
        }

        const passwordValid = bcrypt.compareSync(password, usuario.password);
        if (!passwordValid) {
            return res.status(400).json({
                ok: false,
                msg: 'Password no valido'
            })
        }

        const token = await (generarJWT(usuario._id, usuario.name))

        res.status(200).json({
            ok: true,
            usuario,
            token
        })

    } catch(err){
        console.log(err);
        res.status(500).json({
            ok: false,
            err
        })
    }

}

const revalidarToken = async (req, res = express.request ) => {
    const {uid,name} = req

    const token = await (generarJWT(uid,name))
    
    res.json({
     ok: true,
     token
    }); 
}

module.exports = {
    loginUsuario,
    crearUsuario,
    revalidarToken
}
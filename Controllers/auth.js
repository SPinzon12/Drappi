const express = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = express.request ) => {
   const { email, password } = req.body;
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

        const token = await (generarJWT(usuario.id, usuario.name))

        res.status(200).json({
            ok: true,
            usuario,
            token
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

        const token = await (generarJWT(usuario.id, usuario.name))

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


const addToCart  = async (req, res = express.request ) => {
    const { email, product } = req.body;
    console.log(email, product)
    try {
        let inCart = await Usuario.aggregate([{ $match: { email: email}},{ $unwind: "$cart" },{ $match: {"cart.name": product.name}},{$replaceRoot:{'newRoot': '$cart'}}])
        if (inCart.length == 0) {
            product.quantity = 1
            await Usuario.updateOne({ email: email },{ $addToSet: {cart:product} })
            res.status(200).json({
                ok: true,
                msg: 'Se agrego producto'
            })
        } else {
            inCart[0].quantity = inCart[0].quantity + 1
            await Usuario.updateOne({$and:[{email: email},{'cart.name':product.name}] }, {$set: {'cart.$.quantity':inCart[0].quantity}})
            res.status(200).json({
                ok: true,
                msg: 'Se aumento la cantidad del producto',
            })
        }
    }catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}

const incrementQuantity  = async (req, res = express.request ) => {
    const { email, product } = req.body;
    let inCart = await Usuario.aggregate([{ $match: { email: email}},{ $unwind: "$cart" },{ $match: {"cart.name": product.name}},{$replaceRoot:{'newRoot': '$cart'}}])
    inCart[0].quantity = inCart[0].quantity + 1
    await Usuario.updateOne({$and:[{email: email},{'cart.name':product.name}] }, {$set: {'cart.$.quantity':inCart[0].quantity}})

    try {
        res.status(200).json({
            ok: true,
            msg: 'Se aumento la cantidad del producto',
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}

const decrementQuantity = async (req, res = express.request ) => {
    const { email, product } = req.body;
    let inCart = await Usuario.aggregate([{ $match: { email: email}},{ $unwind: "$cart" },{ $match: {"cart.name": product.name}},{$replaceRoot:{'newRoot': '$cart'}}])
    inCart[0].quantity = inCart[0].quantity - 1
    try{
        if(inCart[0].quantity === 0){
            await Usuario.updateOne({email: email}, {$pull: {cart:{ name : product.name}}})
            res.status(200).json({
                ok: true,
                msg: 'Se elimino el producto',
            })
        }else{
            await Usuario.updateOne({$and:[{email: email},{'cart.name':product.name}] }, {$set: {'cart.$.quantity':inCart[0].quantity}})
            res.status(200).json({
                ok: true,
                msg: 'Se disminuyo la cantidad del producto',
            })
        }
    }catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }

}

const inCart = async (req, res = express.request) => {
    const {email} = req.body
    let inCart = await Usuario.find({ email: email });
    inCart = inCart[0].cart
    try {
        res.status(200).json({
            ok: true,
            inCart,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}

const deleteCart = async (req, res = express.request) => {
    const {email} = req.body
    await Usuario.updateOne({email: email}, {$unset:{cart:[]}})
    await Usuario.updateOne({email: email}, {$set:{cart:[]}})
    try {
        res.status(200).json({
            ok: true,
            msg: 'Se eliminaron los productos del carrito',
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}

module.exports = {
    loginUsuario,
    crearUsuario,
    revalidarToken,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    inCart,
    deleteCart
}
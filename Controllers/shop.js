const express = require('express');
const Shop = require('../models/Shop');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')


const createShop = async (req, res = express.request ) => {
    const { name, password } = req.body;
    try {
        let shop = await Shop.findOne({name:name})
        if (shop) {
            return res.status(400).json({
                ok: false,
                msg: 'La tienda con ese correo ya existe o el nombre de la tienda ya existe'
            })
        }else{
            shop = new Shop(req.body);
            const salt = bcrypt.genSaltSync();
            shop.password = bcrypt.hashSync(password,salt);
            await shop.save();
            res.status(200).json({
                ok: true,
                shop,
            }); 
        }
    } catch (err){
         console.log(err);
         res.status(500).json({
             ok: false,
             err
         })
    }
}

const addProduct  = async (req, res = express.request ) => {
    const { name, product } = req.body;
    try {
        let inProducts = await Shop.aggregate([{ $match: { name: name}},{ $unwind: "$products" },{ $match: {"products.name": product.name}},{$replaceRoot:{'newRoot': '$products'}}])
        if (inProducts.length == 0) {
            await Shop.updateOne({ name: name },{ $push: { products: {id:new mongoose.Types.ObjectId(), name:product.name, img: product.img, description: product.description, price: product.price}}})
            res.status(200).json({
                ok: true,
                msg: 'Se agrego producto'
            })
        } else {
            res.status(400).json({
                ok: true,
                msg: 'Ya existe el producto',
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

const inShop = async(req, res = express.request) => {
    const inShop = await Shop.find()
    try {
        res.status(200).json({
            ok: true,
            inShop,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }

}

const deleteProduct = async(req, res = express.request) => {
    const { shop, product } = req.body    
    await Shop.updateOne({name: shop.name}, {$pull: {products:{ name : product.name}}})
    try {
        res.status(200).json({
            ok: true,
            msg: 'Se elimino el producto'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}

const deleteShop = async(req, res = express.request) => {
    const {shop} = req.body
    await Shop.deleteOne({name:shop.name})
    try {
        res.status(200).json({
            ok: true,
            msg: 'Se elimino la tienda'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}

const loginShop = async (req, res = express.request ) => {
    const { email, password } = req.body;
    
    try {
        let shop = await Shop.findOne({email:email})
        if (!shop) {
            return res.status(400).json({
                ok: false,
                msg: 'La tienda no existe'
            })
        }

        const passwordValid = bcrypt.compareSync(password, shop.password);
        if (!passwordValid) {
            return res.status(400).json({
                ok: false,
                msg: 'Password no valido'
            })
        }

        const token = await (generarJWT(shop.id, shop.name))

        res.status(200).json({
            ok: true,
            shop,
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

const updateShop = async(req, res = express.request) => {
    console.log(req.body)
    let { shop, delivery, time } = req.body
    if (delivery == ''){
        shop = await Shop.findOne({name: shop.name})
        delivery = shop.delivery
    }
    if (time == ''){
        shop = await Shop.findOne({name: shop.name})
        time = shop.time
    }
    await Shop.updateOne({name: shop.name}, {$set:{delivery:delivery, time:time}})
    try {
        res.status(200).json({
            ok: true,
            msg: 'Se actualizo la información de la tienda'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}

const updateProduct = async(req, res = express.request) => {
    console.log(req.body)
    let { shop, product, price, description, img} = req.body
    const name = shop.name
    shop = await Shop.aggregate([{ $match: {name: shop.name}},{ $unwind: "$products" },{ $match: {"products.name": product.name}},{$replaceRoot:{'newRoot': '$products'}}])
    if (price == ''){
        price = shop[0].price
    }
    if (description == ''){
        description = shop[0].description
    }
    if (img == ''){
       img = shop[0].img
    }
    console.log(shop[0].name)
    saved =  await Shop.updateOne({$and:[{name: name},{'products.name':product.name}] },{$set:{'products.$.price':price,'products.$.description':description, 'products.$.img':img}})
    console.log(saved)
    try {
        res.status(200).json({
            ok: true,
            msg: 'Se actualizo la información del producto'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}

const userShop = async(req, res = express.request) => {
    const {name} = req.body
    let inShop = await Shop.find({ name: name });
    inShop = inShop[0]
    try {
        res.status(200).json({
            ok: true,
            inShop,
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
    createShop,
    addProduct,
    inShop,
    deleteProduct,
    deleteShop,
    loginShop,
    updateShop,
    updateProduct,
    userShop
}
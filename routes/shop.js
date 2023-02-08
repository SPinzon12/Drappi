const express = require('express')
const router = express.Router();
const { createShop, addProduct, inShop, deleteProduct, deleteShop, loginShop, updateShop, updateProduct, userShop } = require('../Controllers/shop');
// const { validarCampos } = require('../middlewares/validar-campos')
// const { validarJWT } = require('../middlewares/validar-token')

router.post('/new', createShop)

router.post('/add', addProduct)

router.post('/delp', deleteProduct)

router.post('/dels', deleteShop)

router.post('/login', loginShop)

router.post('/upds', updateShop)

router.post('/user', userShop)

router.post('/updp', updateProduct)

router.get('/', inShop)

module.exports = router;
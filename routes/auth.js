const express = require('express')
const router = express.Router();
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken, addToCart, incrementQuantity, decrementQuantity, inCart, deleteCart  } = require('../Controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-token')

router.post('/inc', incrementQuantity)

router.post('/', loginUsuario )

router.post('/add', addToCart )

router.post('/del', deleteCart)

router.post('/dec', decrementQuantity)

router.post(
    '/new',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'adsda').isLength({min:6}),
        validarCampos
    ],
    crearUsuario )

router.get('/renew', validarJWT ,revalidarToken)

router.post('/cart', inCart )
module.exports = router;
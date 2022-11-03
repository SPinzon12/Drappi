const express = require('express')
const router = express.Router();
const { validarJWT } = require('../middlewares/validar-token')
const { crearTask, listarTasks } = require('../Controllers/task');


router.use(validarJWT)

router.get('/', listarTasks)
router.post('/', crearTask)

module.exports = router;
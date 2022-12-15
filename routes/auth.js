const { Router } = require ('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { login, googleSignIN } = require('../controllers/auth');



const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'la password es obligatoria').not().isEmpty(),
    validarCampos
],login  );

router.post('/google', [
    check('id_token', 'id_Token de google es necesario').not().isEmpty(),
    validarCampos
], googleSignIN  );


module.exports = router;
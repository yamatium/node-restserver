const { Router } = require ('express');
const { check } = require('express-validator');


const { validarCampos } = require('../middlewares/validar-campos');
const { cargarArchivo, actualizarImagen, mostrarImagen } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');


const router = Router();


router.post( '/', cargarArchivo);

router.put('/:coleccion/:id', [
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas ( c, ['usuarios', 'productos'] ) ),
    validarCampos
], actualizarImagen)


router.get('/:coleccion/:id', [
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas ( c, ['usuarios', 'productos'] ) ),
    validarCampos
], mostrarImagen)




module.exports = router;
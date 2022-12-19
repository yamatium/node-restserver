const { Router } = require('express');
//const router = Router();
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearProducto, 
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto,
        borrarProducto } = require('../controllers/productos');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();


//obtener todas las categorias - publico
router.get('/', obtenerProductos );

// obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto );

// Crear categoria - privado - cualquier persona con token valido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto );

// actualizar - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    //check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto );

// borrar una categoria - admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
] , borrarProducto );


 
module.exports = router;
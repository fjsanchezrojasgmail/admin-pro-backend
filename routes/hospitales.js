/*

        Ruta: /api/hospitales

*/


const { Router } = require('express');
const { check } = require('express-validator');
const { getHospitales,crearHospital,actualizarHospital,borrarHospital } = require('../controllers/hospital');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

router.get( '/',validarJWT, getHospitales);

router.post( '/', 
    [
        validarJWT,
        check('nombre','El nombre del hospital es obligatorio.').not().isEmpty(),
        validarCampos,
    ],crearHospital);

router.delete( '/:id',borrarHospital);

router.put( '/:id',[
], actualizarHospital);

module.exports = router;
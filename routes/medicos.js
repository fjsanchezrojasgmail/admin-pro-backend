/*

        Ruta: /api/medicos

*/


const { Router } = require('express');
const { check } = require('express-validator');
const { getMedicos,crearMedico,actualizarMedico,borrarMedico,deleteMedico } = require('../controllers/medicos');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

router.get( '/',validarJWT, getMedicos);

router.post( '/',validarJWT, [
    check('nombre','El nombre es obligatorio.').not().isEmpty(),
    check('password','La password es obligatoria.').not().isEmpty(),
    check('email','El email es obligatorio.').isEmail(),
    check('hospital','El nombre del hospital es obligatorio.').not().isEmpty(),
    check('hospital','El hospital id debe de ser valido.').isMongoId(),
    validarCampos,
],crearMedico);

router.delete( '/:id',validarJWT,borrarMedico);

router.delete('/deleteMedico/:id',validarJWT,deleteMedico);

router.put( '/:id',validarJWT,[
    check('nombre','El nombre es obligatorio.').not().isEmpty(),
    check('email','El email es obligatorio.').isEmail(),
    check('role','El role es obligatorio.').not().isEmpty(),
    check('hospital','El nombre del hospital es obligatorio.').not().isEmpty(),
    validarCampos,
], actualizarMedico);

module.exports = router;
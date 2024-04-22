/*

        Ruta: /api/auth

*/


const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();


router.post( '/',[
    check('password','La password es obligatoria.').not().isEmpty(),
    check('email','El email es obligatorio.').isEmail(),
    validarCampos,
], login);




module.exports = router;
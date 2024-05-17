/*

        Ruta: /api/upload/:coleccion/:id

*/

const { Router } = require('express');
const expressfileUpload = require('express-fileupload');
const { fileUpload, fileDownload } = require('../controllers/upload');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

router.use(expressfileUpload());


router.put('/:coleccion/:id',validarJWT, fileUpload );

router.get('/:coleccion/:imagen',validarJWT, fileDownload );



module.exports = router;
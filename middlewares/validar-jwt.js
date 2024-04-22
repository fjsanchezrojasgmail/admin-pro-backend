const { response } = require('express');
const jwt = require('jsonwebtoken');


const validarJWT = ( req ,res = response, next) => {

   //LEER TOKEN

    const token = req.header('x-token');

    if(!token ){
        return res.status(401).json({
            ok:false,
            msg: 'No hay token en la petición.'
        });


    }

    try{

        console.log(token);

        const { uid } = jwt.verify( token, process.env.JWT_SECRETKEY );

        req.uid = uid;

        next();

    }catch(error){
        return res.status(401).json({
            ok:false,
            msg:'Token no válido'
        });
    }

    
}

module.exports = {
    validarJWT
}
const Usuario = require('../models/usuario');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios =  async (req,res = response ) =>{

    const desde = Number(req.query.desde) || 0;
    

    const [ usuarios, total ] = await Promise.all([

        Usuario
            .find({ google : true },'nombre email role google img')
            .skip( desde )
            .limit(5),

        Usuario.countDocuments()

    ])



    res.status(200).json({
        ok: true,
        usuarios,
        total,
        uid: req.uid,
});
}

const crearUsuario =  async( req,res = response ) =>{

    const { email, password, nombre } = req.body;

   

    try {

        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado.'
            });
        }



        const usuario = new Usuario( req.body );

        

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();

        usuario.password = bcrypt.hashSync( password, salt );
    
        //guardar usuario
        await usuario.save();

        const token = await generarJWT( usuario.id );

        res.status(200).json({
            ok: true,
            usuario,
            token: token
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs.'
        })
    }

    
    
}

const actualizarUsuario = async( req,res = response ) => {

    const uid = req.params.id

    console.log("Actualizar usuario");

   

    //TODO: Validar token y comprobar el usuario correcto

    try {

        const usuarioDB = await Usuario.findById( uid );

        //comprobamos si existe usuario con ese id en la autenticacion
        if(!usuarioDB) {
            return res.status(404).json({
                ok:false,
                msg:'No existe usuario con ese id.'
            });
        }

        //Actualizaciones
        
        const { password,google,email,...campos} = req.body;

        //si intentamos meter un email que ya existe en la BD
        if( usuarioDB.email !== email ){
        
            const existeEmail = await Usuario.findOne({ email });

            if( existeEmail ){
                return res.status(400).json({
                    ok:false,
                    msg:"Ya existe un usuario con ese email."
                })
            }

        }

        // delete campos.password;
        // delete campos.google;

        campos.email = email;
        

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );
        

        res.json({
            ok:true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.log(
            error
        );
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        })
    }

}

const deleteUsuario =  async( req,res = response ) =>{

    const uid = req.params.id;

    console.log("Borrar usuario: ", uid);

    try {


        const usuarioDB = await Usuario.findById( uid );

        //comprobamos si existe usuario con ese id en la autenticacion
        if(!usuarioDB) {
            return res.status(404).json({
                ok:false,
                msg:'No existe usuario con ese id.'
            });
        }

        await Usuario.findByIdAndDelete( uid );


        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    }catch(error){

        res.status(500).json({
            ok:false,
            msg:"Error hable con el administrador."
        })
    }

}

const borrarUsuario =  async( req,res = response ) =>{

    const uid = req.params.id;

    console.log("Borrar usuario: ", uid);

    //comprobamos si existe el usuario:

    try {

        //const { nombre,password,email,role,...campos} = await Usuario.findById( uid );

        const usuarioDB = await Usuario.findById( uid );

        const { nombre,password,email,role,...campos} = usuarioDB;

        console.log("Buscamos usuario: ", usuarioDB.email);


            usuarioDB.google = false;

            console.log("Usuario existe actualizamos: ", campos);

            const usuarioActualizado = await Usuario.findByIdAndUpdate(uid,usuarioDB, { new: true })

            res.status(200).json({
                ok: true,
                usuario: usuarioActualizado
            });

        


    }catch(error){

        res.status(400).json({
            ok:false,
            msg:"Usuario no existe."
        })
    }
    

    

}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
    deleteUsuario,
}
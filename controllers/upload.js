const path = require('path');
const { response } = require('express');
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');
const fs = require('fs');


const fileUpload = async (req,res = response ) =>{

    const tabla = req.params.coleccion;
    const id = req.params.id;

    const tiposValidos = ['hospitales','medicos','usuarios'];
    
    if(tiposValidos.includes(tabla)){

        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(400).json({
                ok: false,
                tabla,
                id,
                msg: "No se ha adjuntado ningun fichero."
            });
        
        }

        //Procesar fichero....
        const file = req.files.imagen;

        const nombreCortado = file.name.split('.');
        const extensionArchivo = nombreCortado[ nombreCortado.length -1];

        //validar extension
        const extensionesValidas = ['png','jpg','jpeg','gif'];
        if( !extensionesValidas.includes( extensionArchivo ) ) {

            return res.status(400).json({
                ok: false,
                msg: "Extensión de fichero no valida."
            });

        }

        //Generar el nombre del archivo
        const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

        //Path para guardar la imagen
        const path = `./uploads/${ tabla }/${ nombreArchivo }`;

        // Use the mv() method to place the file somewhere on your server
        file.mv(path, function(err) {
            if (err){
                console.log(err);
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al mover el fichero al servidor'
                })

            }

            //actualizar la base de datos
            actualizarImagen(tabla,id, path, nombreArchivo);
            
            return res.status(200).json({
                ok: true,
                tabla,
                id,
                msg: "File Uploaded: " + nombreArchivo
            });

        });

        

    }else{


        return res.status(400).json({
        ok: false,
        tabla,
        id,
        msg: "No es un tipo valido."


    });

    }

    

}

const fileDownload = ( req, res ) => {
    const tipo = req.params.coleccion;
    const imagen = req.params.imagen;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ imagen }`);
    const pathDefault = path.join( __dirname, `../uploads/no-img.jpg`);

    //imagen por defecto
    if( fs.existsSync( pathImg )){
        res.sendFile( pathImg );
    }else{
        res.sendFile( pathDefault );
    }

    
}

module.exports = {
   fileUpload,fileDownload,
}
const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = ( path,tipo ) => {

    //const pathViejo = `./uploads/medicos/${ medico.img }`;

            if(fs.existsSync( path )){
                fs.unlinkSync( path );
            }


}

const actualizarImagen = async(tipo,id, path, nombreArchivo) => {


    switch ( tipo ) {

        case 'medicos':

        console.log('Intentamos encontrar al medico: ', id );

            const medico= await Medico.findById(id);

            if(!medico){

                console.log('No se encontro medico por id');
                return false;

            }


            const pathViejoMedico = `./uploads/medicos/${ medico.img }`;

            borrarImagen(pathViejoMedico,tipo);


            medico.img = nombreArchivo;
            await medico.save();
            return true;

        break;

        case 'hospitales':

        const hospital= await Hospital.findById(id);

        console.log('Intentamos encontrar al hospital: ', id );

            if(!hospital){

                console.log('No se encontro hospital por id');
                return false;

            }


            const pathViejoHospital = `./uploads/hospitales/${ hospital.img }`;

            borrarImagen(pathViejoHospital,tipo);


            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
            
        break;

        case 'usuarios':

        console.log('Intentamos encontrar al usuario: ', id );

        const usuario= await Usuario.findById(id);

            if(!usuario){

                console.log('No se encontro usuario por id');
                return false;

            }


            const pathViejoUsuario = `./uploads/usuarios/${ usuario.img }`;

            console.log('Subir fichero usuario: ', usuario );

            borrarImagen(pathViejoUsuario,tipo);


            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
            
        break;
    
        default:

        break;
    }


}

module.exports = {
    actualizarImagen
}
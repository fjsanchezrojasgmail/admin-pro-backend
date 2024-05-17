const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const hospital = require('../models/hospital');


const getMedicos =  async (req,res = response ) =>{

    const medicos = await Medico.find({ google : true },'nombre email img hospital role google')
                                                .populate('usuario','nombre img');

 
    //accedemos al nombre del hospital en funcion de su id
    for (let index = 0; index < medicos.length; index++) {

        const hospitalDB = await Hospital.findOne({ _id:  medicos[index].hospital });
        
        //asignamos al nombre del hospital en el listado que sacamos.
        medicos[index].nombreHospital = hospitalDB.nombre;
            

    }
   
    res.status(200).json({
        ok: true,
        medicos,
        uid: req.uid,
});
}

const getHospitalname = async(hospitalID) => {
    const hospitalDB = await Hospital.findOne({ _id: hospitalID });
    return hospitalDB.nombre;
}

const crearMedico =  async( req,res = response ) =>{

    const { email, password, nombre, hospital } = req.body;

    const uid = req.uid;


    try {
        //comprobamos email
        const existeEmail = await Medico.findOne({ email });

        if ( existeEmail ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado.'
            });
        }

    console.log("Buscamos hospital", hospital);

        //comprobamos hospital
        const hospitalDB = await Hospital.findOne({ _id: hospital });

    console.log("Resultado", hospitalDB.nombre);

        if ( !hospitalDB ){
            return res.status(400).json({
                ok: false,
                msg: 'No existe hospital con ese nombre.'
            });
        }

        
        //creamos medico
        const medico = new Medico( { 
            usuario: uid,
            hospital: hospitalDB,
            ...req.body } );
        

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();

        medico.password = bcrypt.hashSync( password, salt );

        
    
        //guardar medico
        await medico.save();

        const token = await generarJWT( medico.id );

        res.status(200).json({
            ok: true,
            medico,
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

const actualizarMedico = async( req,res = response ) => {

    const uid = req.params.id

    console.log("Actualizar medico");



    try {

        const medicoDB = await Medico.findById( uid );

        //comprobamos si existe medico con ese id en la autenticacion
        if(!medicoDB) {
            return res.status(404).json({
                ok:false,
                msg:'No existe medico con ese id.'
            });
        }

        //Actualizaciones
        
        const { password,google,email,...campos} = req.body;

        //si intentamos meter un email que ya existe en la BD
        if( medicoDB.email !== email ){
        
            const existeEmail = await Medico.findOne({ email });

            if( existeEmail ){
                return res.status(400).json({
                    ok:false,
                    msg:"Ya existe un medico con ese email."
                })
            }

        }

        // delete campos.password;
        // delete campos.google;

        campos.email = email;
        

        const medicoActualizado = await Medico.findByIdAndUpdate( uid, campos, { new: true } );
        

        res.json({
            ok:true,
            medico: medicoActualizado
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

const deleteMedico =  async( req,res = response ) =>{

    const uid = req.params.id;

    console.log("Borrar medico: ", uid);

    try {


        const medicoDB = await Medico.findById( uid );

        //comprobamos si existe medico con ese id en la autenticacion
        if(!medicoDB) {
            return res.status(404).json({
                ok:false,
                msg:'No existe medico con ese id.'
            });
        }

        await Medico.findByIdAndDelete( uid );


        res.status(200).json({
            ok: true,
            msg: 'Medico eliminado'
        });

    }catch(error){

        res.status(500).json({
            ok:false,
            msg:"Error hable con el administrador."
        })
    }

}

const borrarMedico =  async( req,res = response ) =>{

    const uid = req.params.id;

    console.log("Borrar medico: ", uid);

    //comprobamos si existe el medico:

    try {

        //const { nombre,password,email,role,...campos} = await Medico.findById( uid );

        const medicoDB = await Medico.findById( uid );

        const { nombre,password,email,role,...campos} = medicoDB;

        console.log("Buscamos medico: ", medicoDB.email);


        medicoDB.google = false;

            console.log("Medico existe actualizamos: ", campos);

            const medicoActualizado = await Medico.findByIdAndUpdate(uid,medicoDB, { new: true })

            res.status(200).json({
                ok: true,
                medico: medicoActualizado
            });

        


    }catch(error){

        res.status(400).json({
            ok:false,
            msg:"Medico no existe."
        })
    }
    

    

}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    deleteMedico,
}
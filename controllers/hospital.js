const Hospital = require('../models/hospital');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const getHospitales =  async (req,res = response ) =>{

    const hospitales = await Hospital
    .find()
    .populate('usuario','nombre email img');

    res.status(200).json({
        ok: true,
        hospitales,
        uid: req.uid,
});
}

const crearHospital =  async( req,res = response ) =>{

    const uid = req.uid;
    const hospital = new Hospital( { 
        usuario: uid,
        ...req.body } );
    

    try{

        const hospitalDB = await hospital.save();

        res.status(200).json({
            ok:true,
            hospital: hospitalDB
        })

    }catch(error){
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        })
    }
    
}

const actualizarHospital = async( req,res = response ) => {

    try{

        res.status(200).json({
            ok:true,
            msg:'actualizar Hospital'
        })

    }catch(error){
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        })
    }
   
}

const borrarHospital =  async( req,res = response ) =>{

    try{
        res.status(200).json({
            ok:true,
            msg:'borrar Hospital'
        })

    }catch(error){
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        })
    }
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital,
}
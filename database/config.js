const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async () => {

    try{

            await mongoose.connect(process.env.DB_CNN);
    
            console.log('Db-online');

    }catch(error){

            console.log(error);

            throw new Error('Error de conexion a la base de datos.');

    }



}

module.exports = {
    dbConnection
}
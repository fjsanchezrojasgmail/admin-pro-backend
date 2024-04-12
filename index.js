
require('dotenv').config();

const express = require('express');

const cors = require('cors');

const { dbConnection } = require('./database/config');

//crear el servidor de express

const app = express();

//configurar CORS
app.use(cors());

// Base de datos
dbConnection();

console.log( process.env );

//rutas

app.get( '/', (req,res) =>{
    res.status(400).json({
        ok: true,
        msg: 'hola'
})
} );

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto: ' + 3000)
})
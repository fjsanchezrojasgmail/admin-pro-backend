
require('dotenv').config();

const express = require('express');

const cors = require('cors');

const { dbConnection } = require('./database/config');

//crear el servidor de express

const app = express();

//configurar CORS
app.use(cors());

//Lectura del body
app.use( express.json() )

// Base de datos
dbConnection();

//console.log( process.env );

//Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto: ' + process.env.PORT)
})
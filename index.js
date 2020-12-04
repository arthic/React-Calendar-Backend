// npm init -y
// node index.js
/*
Ejecutar como admin
Linux: sudo npm i nodemon -g
Como Admin
Windows: npm i nodemon -g
*/

// npm run dev
// Configuración de Express
// npm i express
// npm i express@4.17.1
const express = require('express')
// npm i dotenv | leer varaibles de entorno
require('dotenv').config()
// npm install cors
const cors = require('cors')
// npm i mongoose
const {dbConnection} = require('./database/config')

// Crear el servidor de express
const app = express()

// Solución Coont get/login
const path = require('path');
const publicPath = path.join(__dirname, '..', 'public');

// Cors
app.use(cors())
// Base de Datos
dbConnection()

// Directorio público
/* Use: Middleware en express, el cual es una funcion que
se ejecuta en el momento que alguine hace una paticion al
server*/
app.use(express.static('public'))

// Lectura y parseo del body
app.use(express.json())

/****** Rutas ******/
// Todo lo de "require" exporta lo toma como ruta "la ruta anterior"
app.use('/api/auth', require('./routes/auth'))
// TODO: CRUD // Eventos
app.use('/api/events', require('./routes/events'))

// Escuchar peticiones
app.listen(process.env.PORT, () => {
	console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
})

app.get('*', (req, res) => {
	res.sendFile(path.join(publicPath, 'index.html')), function(err) {
	if (err) {
		res.status(500).send(err)
		}
	};
});
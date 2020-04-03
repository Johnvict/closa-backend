import { Mongoose } from 'mongoose'
const mongoose = new Mongoose();
import express from 'express'
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept")
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
	next()
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


let server = require('http').createServer(app);
let io = require('socket.io')(server);


mongoose.connect('mongodb://localhost/live', { useUnifiedTopology: true, useNewUrlParser: true })
.then( () => {
	console.log('Connected to db')	
}).catch( (e: any) => {
	console.log(`FATAL ERROR: COULD NOT CONNECT TO DB ${e}`);
  	process.exit(1)
})

server.listen(port, () => {
	console.log(`app running on https://localhost:${port}`)
})

module.exports = { mongoose, app, io, server }
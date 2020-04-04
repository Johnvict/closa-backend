import express from 'express'
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT
declare var global: any;

const Sequelize = require('sequelize');

const sequelize = new Sequelize('next_bk', 'root', '', {
	host: 'localhost',
	dialect: 'mysql'
});


sequelize.authenticate().then(() => {
	console.log('DB Connection established successfully.');
}).catch(err => {
	console.error('FATAL ERROR, Unable to connect to the DB:', err);
	process.exit(1);
});


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


server.listen(port, () => {
	console.log(`app running on https://localhost:${port}`)
})


module.exports = { sequelize, app, io, server }
global.sequelize = sequelize;
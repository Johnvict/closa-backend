"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var bodyParser = require('body-parser');
var app = express_1.default();
var port = process.env.PORT;
var Sequelize = require('sequelize');
var sequelize = new Sequelize('next_bk', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});
sequelize.authenticate().then(function () {
    console.log('DB Connection established successfully.');
}).catch(function (err) {
    console.error('FATAL ERROR, Unable to connect to the DB:', err);
    process.exit(1);
});
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(port, function () {
    console.log("app running on https://localhost:" + port);
});
module.exports = { sequelize: sequelize, app: app, io: io, server: server };
global.sequelize = sequelize;

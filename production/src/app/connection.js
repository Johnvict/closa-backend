"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = require('body-parser');
const app = express_1.default();
const port = process.env.PORT;
const environment = process.env.NODE_ENV;
let db, dbUser, dbPassword;
if (environment == 'production') {
    db = process.env.PROD_DB_NAME;
    dbUser = process.env.PROD_DB_USER;
    dbPassword = process.env.PROD_DB_PASSWORD;
}
else {
    dbUser = process.env.DB_USER;
    db = process.env.DB_NAME;
    dbPassword = process.env.DB_PASSWORD;
}
console.table({ db, dbUser, dbPassword });
const Sequelize = require('sequelize');
const sequelize = new Sequelize(db, dbUser, dbPassword, {
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
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let server = require('http').createServer(app);
let io = require('socket.io')(server);
server.listen(port, () => {
    console.log(`app running on https://localhost:${port}`);
});
module.exports = { sequelize, app, io, server };
global.sequelize = sequelize;

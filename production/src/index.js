"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require('./app/config');
const { io, app, server, sequelize } = require('./app/connection');
const Routes = require('./routes/routes');
const Relationship = require('./models/definition/Relationships');
const exported_classes_1 = require("./app/exported.classes");
const globalErrorHandler = require('./misc/global.error.handler');
// console.log(process.env)
app.get('/', (req, res) => res.send('Hello! Make request to /api'));
app.use('/api', Routes);
app.all('*', (req, res, next) => {
    next(new exported_classes_1.AppError(`Sorry ${req.originalUrl} is not found on this server `, 404));
});
app.use(globalErrorHandler);
// const func = () => {
// 	Math.sin(90);
// 	Math.asin(0.0809);
// }

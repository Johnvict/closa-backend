// const functions = require('firebase-functions');

const config = require('./app/config');
const { io, app, server, sequelize } = require('./app/connection')
const Routes = require('./routes/routes');
const Relationship = require('./models/definition/Relationships');
import { AppError } from './app/exported.classes'
const globalErrorHandler = require('./misc/global.error.handler');
// console.log(process.env)

app.get('/', (req, res) => res.send('Hello! Make request to /api'))
app.use('/api', Routes)

app.all('*', (req, res, next) => {
	// next(new AppError(`Sorry ${req.originalUrl} is not found on this server `, 404));
})

app.use(globalErrorHandler)

// exports.ap = functions.onRequest(app);




// const func = () => {
// 	Math.sin(90);
// 	Math.asin(0.0809);
// }
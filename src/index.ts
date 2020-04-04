const config = require('./app/config');
const { io, app, server, sequelize } = require('./app/connection')
const Routes = require('./routes/routes');

	
app.get('/', (req, res) => res.send('Hello! Make request to /api'))
app.use('/api', Routes)

// const func = () => {
// 	Math.sin(90);
// 	Math.asin(0.0809);
// }
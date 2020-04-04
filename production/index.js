"use strict";
var config = require('./app/config');
var _a = require('./app/connection'), io = _a.io, app = _a.app, server = _a.server, sequelize = _a.sequelize;
var Routes = require('./routes/routes');
var Relationship = require('./models/definition/Relationships');
app.get('/', function (req, res) { return res.send('Hello! Make request to /api'); });
app.use('/api', Routes);

const express = require('express');
const Router = express.Router();

const UserRoutes = require("./user-route");

Router.get('/', (req, res) => {
	res.json({message: 'Hello! API server is working fine'});
});

Router.use('/user', UserRoutes);


module.exports = Router;
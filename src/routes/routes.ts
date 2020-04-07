const express = require('express');
const Router = express.Router();

const UserRoutes = require("./user-route");
const AgentRoutes = require("./agent-route");
const WorkerRoutes = require("./worker-route");

Router.get('/', (req, res) => {
	res.json({ status: 'good', message: 'NeXT! Everything\'s good'});
});


Router.use('/agent', AgentRoutes);
Router.use('/user', UserRoutes);
Router.use('/worker', WorkerRoutes);


module.exports = Router;
const express = require('express');
const Router = express.Router();

const AdminRoutes = require("./admin-route");
const UserRoutes = require("./user-route");
const AgentRoutes = require("./agent-route");
const WorkerRoutes = require("./worker-route");
const LocationRoutes = require("./location-route");
const JobRoutes = require("./job-route");
const SearchRoutes = require("./search-route");

Router.get('/', (req, res) => {
	res.json({ status: 'good', message: 'NeXT! Everything\'s good'});
});


Router.use('/admin', AdminRoutes);
Router.use('/agent', AgentRoutes);
Router.use('/user', UserRoutes);
Router.use('/worker', WorkerRoutes);
Router.use('/location', LocationRoutes);
Router.use('/job', JobRoutes);
Router.use('/search', SearchRoutes);



module.exports = Router;
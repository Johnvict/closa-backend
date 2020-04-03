const express = require('express');
const Router = express.Router();
const UserRoutes = require("./user-route");
const ChatRoutes = require("./chat-route");
const Live = require("./live");

Router.get('/', (req, res) => {
	res.json({message: 'Hello! API server is working fine'});
});

Router.use('/user', UserRoutes);
Router.use('/chat', ChatRoutes);
Router.use('/live', Live);


module.exports = Router;
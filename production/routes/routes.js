"use strict";
var express = require('express');
var Router = express.Router();
var UserRoutes = require("./user-route");
Router.get('/', function (req, res) {
    res.json({ message: 'Hello! API server is working fine' });
});
Router.use('/user', UserRoutes);
module.exports = Router;

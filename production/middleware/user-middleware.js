"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JWT = require('jsonwebtoken');
var jwtSecret = process.env.JWT_SECRET;
exports.userMiddleware = function (req, res, next) {
    var token = req.header('authorization');
    if (!token)
        return res.status(401).send('Access denied. Authorization Token not provided.');
    try {
        var tokenDecoded = JWT.verify(token, jwtSecret);
        req.user = tokenDecoded;
        next();
    }
    catch (err) {
        return res.status(401).send('Invalid token.');
    }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JWT = require('jsonwebtoken');
var jwtSecret = "live-chat-is-kjdfhkdjdghvbvjled-edfljdbcdjcd-erqewff355-fwe";
exports.adminMiddleware = function (req, res, next) {
    var token = req.header('authorization');
    if (!token)
        return res.status(401).send('Access denied. Authorization Token not provided.');
    try {
        var tokenDecoded = JWT.verify(token, jwtSecret);
        if (tokenDecoded.role != 'admin')
            return res.status(401).send('Unauthorized. You are not allowed to access this resource.');
        req.user = tokenDecoded;
        next();
    }
    catch (err) {
        return res.status(400).send('Invalid token.');
    }
};

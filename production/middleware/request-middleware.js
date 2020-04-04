"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = function (req, res, next) {
    if (!req.body)
        return res.status(400).send('Invalid request. Please send appropriate data in the request body');
    next();
};

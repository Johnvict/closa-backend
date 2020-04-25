"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const exported_classes_1 = require("./../app/exported.classes");
let JWT = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
exports.agentMiddleware = (req, res, next) => {
    const token = req.header('authorization');
    if (!token)
        return res.status(401).json({ message: 'Access denied. Authorization Token not provided.', status: -1 });
    try {
        const tokenDecoded = JWT.verify(token, jwtSecret);
        if (tokenDecoded.type === 'user' || tokenDecoded.type === 'worker') {
            req.agent = tokenDecoded;
            next();
        }
        else {
            return res.status(401).json({ message: 'Access denied. You cannot access this endpoint', status: -1 });
        }
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid token.', status: -1 });
    }
};
exports.newAgentMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { agent_id, token } = req.body;
    const isTokenValid = yield exported_classes_1.tokenModel.validateToken({ agent_id, token });
    req.agent = { id: agent_id, token };
    if (isTokenValid)
        return next();
    return res.status(401).json({ message: 'Invalid token provided.', status: -1 });
});
exports.userMiddleware = (req, res, next) => {
    const token = req.header('authorization');
    if (!token)
        return res.status(401).json({ message: 'Access denied. Authorization Token not provided.', status: -1 });
    try {
        const tokenDecoded = JWT.verify(token, jwtSecret);
        if (tokenDecoded.type === 'user') {
            req.agent = tokenDecoded;
            next();
        }
        else {
            return res.status(401).json({ message: 'Access denied. You cannot access this endpoint', status: -1 });
        }
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid token.', status: -1 });
    }
};
exports.workerMiddleware = (req, res, next) => {
    const token = req.header('authorization');
    if (!token)
        return res.status(401).json({ message: 'Access denied. Authorization Token not provided.', status: -1 });
    try {
        const tokenDecoded = JWT.verify(token, jwtSecret);
        if (tokenDecoded.type === 'worker') {
            req.agent = tokenDecoded;
            next();
        }
        else {
            return res.status(401).json({ message: 'Access denied. You cannot access this endpoint', status: -1 });
        }
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid token.', status: -1 });
    }
};
exports.adminMiddleware = (req, res, next) => {
    const token = req.header('authorization');
    if (!token)
        return res.status(401).json({ message: 'Access denied. Authorization Token not provided.', status: -1 });
    try {
        const tokenDecoded = JWT.verify(token, jwtSecret);
        if (tokenDecoded.type === 'admin' || tokenDecoded.type === 'super') {
            req.admin = tokenDecoded;
            next();
        }
        else {
            return res.status(401).json({ message: 'Access denied. You cannot access this endpoint', status: -1 });
        }
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid token.', status: -1 });
    }
};
exports.superAdminMiddleware = (req, res, next) => {
    const token = req.header('authorization');
    if (!token)
        return res.status(401).json({ message: 'Access denied. Authorization Token not provided.', status: -1 });
    try {
        const tokenDecoded = JWT.verify(token, jwtSecret);
        if (tokenDecoded.type === 'super') {
            req.admin = tokenDecoded;
            next();
        }
        else {
            return res.status(401).json({ message: 'Access denied. You cannot access this endpoint', status: -1 });
        }
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid token.', status: -1 });
    }
};

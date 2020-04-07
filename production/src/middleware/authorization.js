"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
let ExtractJwt = require('passport-jwt').ExtractJwt;
class Authorization {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET;
    }
    comparePassword(data) {
        return bcrypt.compareSync(data.candidatePassword, data.hashedPassword);
    }
    hashPassword(password) {
        return bcrypt.hashSync(password, salt);
    }
    generateToken(id, phone, type) {
        return jwt.sign({ id, phone, type }, this.jwtSecret, {
            expiresIn: 86400 // Any issued token EXPIRES IN 1 day
        });
    }
    decodeToken() {
        return (req, res, next) => {
            const token = req.header('authorization');
            if (!token)
                return res.status(401).send('Access denied. Authorization Token not provided.');
            console.log(token);
            try {
                const tokenDecoded = jwt.verify(token, this.jwtSecret);
                req.agent = tokenDecoded;
                next();
            }
            catch (err) {
                return res.status(400).send('Invalid token');
            }
        };
    }
}
exports.Authorization = Authorization;

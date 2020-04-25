"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exported_classes_1 = require("./../app/exported.classes");
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
let ExtractJwt = require('passport-jwt').ExtractJwt;
class Authorization {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET;
    }
    comparePassword(next, data, isChangePassword = null) {
        if (bcrypt.compareSync(data.candidatePassword, data.hashedPassword)) {
            return true;
		}

		const statusCode =  isChangePassword ? 200 : 401
		const statusMessage =  isChangePassword ? 'old password is invalid' : 'invalid credential'
		next(new AppError( statusMessage , statusCode, -1))
    }
    hashPassword(password) {
        return bcrypt.hashSync(password, salt);
    }
    generateToken(id, phone, type, otherid) {
        return jwt.sign({ id, phone, type, otherid }, this.jwtSecret, {
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

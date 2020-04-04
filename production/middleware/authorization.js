"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var jwt = require('jsonwebtoken');
var ExtractJwt = require('passport-jwt').ExtractJwt;
var Authorization = (function () {
    function Authorization() {
        this.jwtSecret = process.env.JWT_SECRET;
    }
    Authorization.prototype.comparePassword = function (data) {
        return bcrypt.compareSync(data.candidatePassword, data.hashedPassword);
    };
    Authorization.prototype.hashPassword = function (password) {
        return bcrypt.hashSync(password, salt);
    };
    Authorization.prototype.generateToken = function (id, phone, type) {
        return jwt.sign({ id: id, phone: phone, type: type }, this.jwtSecret, {
            expiresIn: 86400
        });
    };
    Authorization.prototype.decodeToken = function () {
        var _this = this;
        return function (req, res, next) {
            var token = req.header('authorization');
            if (!token)
                return res.status(401).send('Access denied. Authorization Token not provided.');
            console.log(token);
            try {
                var tokenDecoded = jwt.verify(token, _this.jwtSecret);
                req.user = tokenDecoded;
                next();
            }
            catch (err) {
                return res.status(400).send('Invalid token');
            }
        };
    };
    return Authorization;
}());
exports.Authorization = Authorization;

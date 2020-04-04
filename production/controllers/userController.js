"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var exported_classes_1 = require("./../app/exported.classes");
var UserController = (function () {
    function UserController() {
    }
    UserController.prototype.allUsers = function (req, res) {
        exported_classes_1.userModel.getAll().then(function (response) {
            return response.error ? res.status(400).json({
                status: -1,
                message: response.error
            }) : res.status(200).json({
                status: 1,
                data: response.data
            });
        });
    };
    UserController.prototype.createUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                exported_classes_1.userModel.create(req.body).then(function (response) {
                    return response.error ?
                        res.status(400).json({ status: -1, message: response.error }) :
                        res.status(201).json({ status: 1, data: response.data });
                });
                return [2];
            });
        });
    };
    UserController.prototype.updateUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                exported_classes_1.userModel.update(__assign({ id: req.user.id }, req.body)).then(function (response) {
                    return response.error ?
                        res.status(400).json(response.error) :
                        res.status(200).json({ status: 1, data: response.data });
                });
                return [2];
            });
        });
    };
    UserController.prototype.deleteUser = function (req, res) {
        var user = req.user;
        exported_classes_1.userModel.update({ active: false, id: req.user.id }).then(function (response) {
            return response.error ? res.status(401).json({ status: -1, message: response.error }) : res.status(200).json({ status: 1, data: response.data });
        });
    };
    UserController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, phone, password, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, phone = _a.phone, password = _a.password;
                        return [4, exported_classes_1.userModel.findOneWithFilter({ phone: phone })];
                    case 1:
                        user = _b.sent();
                        if (!user)
                            return [2, res.status(401).json({ status: -1, message: 'invalid credentials' })];
                        if (!exported_classes_1.auth.comparePassword({ candidatePassword: password, hashedPassword: user.password }))
                            return [2, res.status(401).json({ status: '-1', message: 'invalid credentials' })];
                        exported_classes_1.userModel.getOne(user.id).then(function (userData) {
                            return userData.data ?
                                res.status(200).json({
                                    status: 1,
                                    token: exported_classes_1.auth.generateToken(user.id, user.phone, user.type),
                                    data: userData.data
                                }) :
                                res.status(500).json({
                                    status: -1,
                                    message: userData.error
                                });
                        });
                        return [2, this.upDateLoginTime(user.id)];
                }
            });
        });
    };
    UserController.prototype.upDateLoginTime = function (id) {
        exported_classes_1.userModel.update({ active: true, lastLoginAt: Date.now(), id: id });
    };
    UserController.prototype.changePassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, old_password, new_password, user, isOldPasswordValid;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, old_password = _a.old_password, new_password = _a.new_password;
                        return [4, exported_classes_1.userModel.findOneWithFilter({ id: req.user.id })];
                    case 1:
                        user = _b.sent();
                        isOldPasswordValid = exported_classes_1.auth.comparePassword({ candidatePassword: old_password, hashedPassword: user.password });
                        if (!isOldPasswordValid)
                            return [2, res.status(401).json({ status: -1, message: 'old password is invalid' })];
                        exported_classes_1.userModel.update({ password: new_password, id: user.id }).then(function (response) {
                            return response.error ? res.status(401).json({ status: -1, message: response.error }) : res.status(201).json({ status: 1, data: user });
                        });
                        return [2];
                }
            });
        });
    };
    return UserController;
}());
exports.UserController = UserController;

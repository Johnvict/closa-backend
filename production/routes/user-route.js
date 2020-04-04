"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var Router = express_1.default.Router();
var user_middleware_1 = require("./../middleware/user-middleware");
var exported_classes_1 = require("./../app/exported.classes");
var validate = exported_classes_1.validator.validate;
Router.post('/', validate(exported_classes_1.validator.newAgent), function (req, res) { return exported_classes_1.userCtrl.createUser(req, res); });
Router.put('/', user_middleware_1.userMiddleware, validate(exported_classes_1.validator.updateAgent), function (req, res) { return exported_classes_1.userCtrl.updateUser(req, res); });
Router.delete('/', user_middleware_1.userMiddleware, function (req, res) { return exported_classes_1.userCtrl.deleteUser(req, res); });
Router.put('/password', user_middleware_1.userMiddleware, validate(exported_classes_1.validator.updatePasswordStruct), function (req, res) { return exported_classes_1.userCtrl.changePassword(req, res); });
Router.post('/login', validate(exported_classes_1.validator.loginData), function (req, res) { return exported_classes_1.userCtrl.login(req, res); });
module.exports = Router;

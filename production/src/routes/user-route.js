"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Router = express_1.default.Router();
const auth_middleware_1 = require("../middleware/auth-middleware");
const exported_classes_1 = require("./../app/exported.classes");
const validate = exported_classes_1.validator.validate;
/* Create new user */
Router.post('/', auth_middleware_1.userMiddleware, validate(exported_classes_1.validator.newUser), (req, res, next) => exported_classes_1.userCtrl.create(req, res, next));
/* Update user */
Router.put('/', auth_middleware_1.userMiddleware, validate(exported_classes_1.validator.updateUser), exported_classes_1.fileCtrl.uploadFile('avatar'), exported_classes_1.fileCtrl.resizeAvatar, (req, res, next) => exported_classes_1.userCtrl.update(req, res, next));
module.exports = Router;

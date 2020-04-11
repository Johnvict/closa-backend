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
/* Create new agent location */
Router.post('/', auth_middleware_1.agentMiddleware, validate(exported_classes_1.validator.newLocation), (req, res, next) => exported_classes_1.locationCtrl.create(req, res, next));
/* Update location */
Router.put('/', auth_middleware_1.agentMiddleware, validate(exported_classes_1.validator.updateLocation), exported_classes_1.fileCtrl.uploadFile('location'), exported_classes_1.fileCtrl.resizeLocation, (req, res, next) => exported_classes_1.locationCtrl.update(req, res, next));
module.exports = Router;

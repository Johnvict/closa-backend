"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Router = express_1.default.Router();
const agent_middleware_1 = require("../middleware/agent-middleware");
const exported_classes_1 = require("./../app/exported.classes");
const validate = exported_classes_1.validator.validate;
/* Create new user */
Router.post('/', agent_middleware_1.agentMiddleware, validate(exported_classes_1.validator.newUser), (req, res) => exported_classes_1.userCtrl.create(req, res));
/* Update user */
Router.put('/', agent_middleware_1.agentMiddleware, validate(exported_classes_1.validator.updateUser), (req, res) => exported_classes_1.userCtrl.update(req, res));
module.exports = Router;

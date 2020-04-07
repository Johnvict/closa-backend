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
/* Create new agent phone */
Router.post('/new', validate(exported_classes_1.validator.newAccount), (req, res) => exported_classes_1.agentCtrl.create(req, res));
/** Continue new account to create agent other data*/
Router.post('/continue', validate(exported_classes_1.validator.newAgent), (req, res) => exported_classes_1.agentCtrl.update(req, res));
/* Update user */
Router.put('/', agent_middleware_1.agentMiddleware, validate(exported_classes_1.validator.updateAgent), (req, res) => exported_classes_1.agentCtrl.update(req, res));
/* Delete user */
Router.delete('/', agent_middleware_1.agentMiddleware, (req, res) => exported_classes_1.agentCtrl.delete(req, res));
/* Update user password */
Router.put('/password', agent_middleware_1.agentMiddleware, validate(exported_classes_1.validator.updatePasswordStruct), (req, res) => exported_classes_1.agentCtrl.changePassword(req, res));
/* Authenticate user */
Router.post('/login', validate(exported_classes_1.validator.loginData), (req, res) => exported_classes_1.agentCtrl.login(req, res));
module.exports = Router;

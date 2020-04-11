"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Router = express_1.default.Router();
const exported_classes_1 = require("./../app/exported.classes");
const validate = exported_classes_1.validator.validate;
/* Create new user */
Router.get('/agents', /* adminMiddleware, validate(validator.newState), */ (req, res, next) => exported_classes_1.agentCtrl.allAgents(req, res, next));
Router.post('/states', /* adminMiddleware, */ validate(exported_classes_1.validator.newManyStates), (req, res, next) => exported_classes_1.adminCtrl.createManyStates(req, res, next));
Router.post('/towns', /* adminMiddleware, */ validate(exported_classes_1.validator.newManyTowns), (req, res, next) => exported_classes_1.adminCtrl.createManyTowns(req, res, next));
Router.post('/state', /* adminMiddleware, validate(validator.newState), */ (req, res, next) => exported_classes_1.adminCtrl.createState(req, res, next));
Router.post('/town', /* adminMiddleware, validate(validator.newTown), */ (req, res, next) => exported_classes_1.adminCtrl.createTown(req, res, next));
Router.put('/state', /* adminMiddleware, validate(validator.updateState), */ (req, res, next) => exported_classes_1.adminCtrl.updateState(req, res, next));
Router.put('/town', /* adminMiddleware, validate(validator.updateTown), */ (req, res, next) => exported_classes_1.adminCtrl.updateTown(req, res, next));
Router.delete('/state', /* adminMiddleware, validate(validator.deleteWithId), */ (req, res, next) => exported_classes_1.adminCtrl.deleteState(req, res, next));
Router.delete('/town', /* adminMiddleware, validate(validator.deleteWithId), */ (req, res, next) => exported_classes_1.adminCtrl.deleteState(req, res, next));
module.exports = Router;

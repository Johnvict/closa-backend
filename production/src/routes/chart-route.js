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
/** Get all jobs from a particular state or town with date range */
Router.post('/jobs', auth_middleware_1.agentMiddleware, validate(exported_classes_1.validator.jobsByStatusFrom), (req, res, next) => exported_classes_1.jobCtrl.jobsByStatusFromStateOrTown(req, res, next));
/** Get a particular job type from a particular state or town with date range */
Router.post('/a-job', auth_middleware_1.agentMiddleware, validate(exported_classes_1.validator.jobWithTitleByStatusFrom), (req, res, next) => exported_classes_1.jobCtrl.jobsByTitleTitleStatusFromStateOrTown(req, res, next));
/** Get a particular job type from a particular state or town with date range */
Router.post('/a-job', auth_middleware_1.agentMiddleware, validate(exported_classes_1.validator.jobWithTitleByStatusFrom), (req, res, next) => exported_classes_1.jobCtrl.jobsByTitleTitleStatusFromStateOrTown(req, res, next));
/** Get search history from everywhere or a particular state or town with date range */
Router.post('/search-history', auth_middleware_1.agentMiddleware, validate(exported_classes_1.validator.searchHistoryByKey), (req, res, next) => exported_classes_1.searchCtrl.searchesForChart(req, res, next));
/* Update job */
Router.put('/', auth_middleware_1.agentMiddleware, validate(exported_classes_1.validator.updateJob), (req, res, next) => exported_classes_1.jobCtrl.update(req, res, next));
module.exports = Router;

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
Router.post('/', auth_middleware_1.agentMiddleware, validate(exported_classes_1.validator.newJob), (req, res, next) => exported_classes_1.jobCtrl.create(req, res, next));
/* Load more jobs */
Router.post('/more', auth_middleware_1.agentMiddleware, validate(exported_classes_1.validator.loadMoreJobs), (req, res, next) => exported_classes_1.jobCtrl.getMore(req, res, next));
Router.get('/all', (req, res, next) => exported_classes_1.jobCtrl.getAllJobs(req, res, next));
/** Get all jobs from a particular state or town with date range */
Router.post('/search-all-record', auth_middleware_1.agentMiddleware, validate(exported_classes_1.validator.jobsByStatusFrom), (req, res, next) => exported_classes_1.jobCtrl.jobsByStatusFrom(req, res, next));
/** Get a particular job type from a particular state or town with date range */
Router.post('/search-a-job', auth_middleware_1.agentMiddleware, validate(exported_classes_1.validator.jobWithTitleByStatusFrom), (req, res, next) => exported_classes_1.jobCtrl.jobsStatusWithTitleFrom(req, res, next));
/* Update job */
Router.put('/', auth_middleware_1.agentMiddleware, validate(exported_classes_1.validator.updateJob), (req, res, next) => exported_classes_1.jobCtrl.update(req, res, next));
module.exports = Router;

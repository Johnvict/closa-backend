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
Router.post('/available-worker', auth_middleware_1.agentMiddleware, validate(exported_classes_1.validator.availableWorkerWithjobsTitle), (req, res, next) => exported_classes_1.searchCtrl.search(req, res, next));
Router.post('/available', auth_middleware_1.agentMiddleware, validate(exported_classes_1.validator.availableWorkerWithjobsTitle), (req, res, next) => exported_classes_1.searchCtrl.searchToArrange(req, res, next));
// Router.post('/', agentMiddleware, validate(validator.newJob), (req, res, next) => jobCtrl.create(req, res, next))
// /* Load more jobs */
// Router.post('/more', agentMiddleware, validate(validator.loadMoreJobs), (req, res, next) => jobCtrl.getMore(req, res, next))
// /** Get all jobs from a particular state or town with date range */
// Router.post('/search-all-record', agentMiddleware, validate(validator.jobsByStatusFrom), (req, res, next) => jobCtrl.jobsByStatusFrom(req, res, next))
// /** Get a particular job type from a particular state or town with date range */
// Router.post('/search-a-job', agentMiddleware, validate(validator.jobWithTitleByStatusFrom), (req, res, next) => jobCtrl.jobsStatusWithTitleFrom(req, res, next))
// /* Update job */
// Router.put('/', agentMiddleware, validate(validator.updateJob), (req, res, next) => jobCtrl.update(req, res, next))
module.exports = Router;

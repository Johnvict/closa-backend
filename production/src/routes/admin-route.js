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
/* Get all admins on our system */
Router.post('/', auth_middleware_1.superAdminMiddleware, validate(exported_classes_1.validator.newAdmin), (req, res, next) => exported_classes_1.adminCtrl.create(req, res, next));
Router.post('/login', validate(exported_classes_1.validator.adminloginData), (req, res, next) => exported_classes_1.adminCtrl.login(req, res, next));
Router.get('/all', auth_middleware_1.superAdminMiddleware, (req, res, next) => exported_classes_1.adminCtrl.allAdmins(req, res, next));
Router.get('/one/:id', auth_middleware_1.superAdminMiddleware, (req, res, next) => exported_classes_1.adminCtrl.oneAdmin(req, res, next));
Router.put('/self', auth_middleware_1.adminMiddleware, validate(exported_classes_1.validator.updateAdmin), (req, res, next) => exported_classes_1.adminCtrl.update(req, res, next));
Router.put('/super', auth_middleware_1.superAdminMiddleware, validate(exported_classes_1.validator.updateAdminSuper), (req, res, next) => exported_classes_1.adminCtrl.updateSuper(req, res, next));
Router.put('/password', auth_middleware_1.adminMiddleware, validate(exported_classes_1.validator.updatePasswordStruct), (req, res, next) => exported_classes_1.adminCtrl.changePassword(req, res, next));
Router.delete('/', auth_middleware_1.superAdminMiddleware, validate(exported_classes_1.validator.deleteWithId), (req, res, next) => exported_classes_1.adminCtrl.delete(req, res, next));
/* Get all agents on our system so far - User and Workers */
Router.get('/agents', auth_middleware_1.adminMiddleware, (req, res, next) => exported_classes_1.agentCtrl.allAgents(req, res, next));
/* Load more - All agents on our system so far - User and Workers */
Router.post('/agents-more', auth_middleware_1.adminMiddleware, validate(exported_classes_1.validator.allLoadMore), (req, res, next) => exported_classes_1.agentCtrl.allAgentsMore(req, res, next));
/** All the jobs so far on our app */
Router.get('/jobs', auth_middleware_1.adminMiddleware, (req, res, next) => exported_classes_1.jobCtrl.getAllJobsForAdmin(req, res, next));
/** Load more - All the jobs so far on our app */
Router.post('/jobs-more', validate(exported_classes_1.validator.allLoadMore), (req, res, next) => exported_classes_1.jobCtrl.getAllJobsMoreForAdmin(req, res, next));
/** Get all jobs from a particular state or town with date range */
Router.post('/job-chart', auth_middleware_1.adminMiddleware, validate(exported_classes_1.validator.jobsByStatusFrom), (req, res, next) => exported_classes_1.jobCtrl.jobsByStatusFromStateOrTownForAdmin(req, res, next));
/** Get a particular job type from a particular state or town with date range */
Router.post('/a-job-chart', auth_middleware_1.adminMiddleware, validate(exported_classes_1.validator.jobWithTitleByStatusFrom), (req, res, next) => exported_classes_1.jobCtrl.jobsByTitleStatusFromStateOrTownForAdmin(req, res, next));
/** All searches so far on our app */
Router.get('/searches', auth_middleware_1.adminMiddleware, (req, res, next) => exported_classes_1.searchCtrl.allSearches(req, res, next));
/** Load more - All searches so far on our app */
Router.post('/searches-more', auth_middleware_1.adminMiddleware, validate(exported_classes_1.validator.allLoadMore), (req, res, next) => exported_classes_1.searchCtrl.allSearchesMore(req, res, next));
/** Get search histories from everywhere or a particular state or town with date range */
Router.post('/search-chart', auth_middleware_1.adminMiddleware, validate(exported_classes_1.validator.searchHistoryByKey), (req, res, next) => exported_classes_1.searchCtrl.searchesForAdmin(req, res, next));
/** Create many states at once */
Router.post('/states', auth_middleware_1.adminMiddleware, validate(exported_classes_1.validator.newManyStates), (req, res, next) => exported_classes_1.adminCtrl.createManyStates(req, res, next));
/** Create many towns at once */
Router.post('/towns', auth_middleware_1.adminMiddleware, validate(exported_classes_1.validator.newManyTowns), (req, res, next) => exported_classes_1.adminCtrl.createManyTowns(req, res, next));
/** Create a state at once */
Router.post('/state', auth_middleware_1.adminMiddleware, validate(exported_classes_1.validator.newState), (req, res, next) => exported_classes_1.adminCtrl.createState(req, res, next));
/** Create a town at once */
Router.post('/town', auth_middleware_1.adminMiddleware, validate(exported_classes_1.validator.newTown), (req, res, next) => exported_classes_1.adminCtrl.createTown(req, res, next));
Router.put('/state', auth_middleware_1.adminMiddleware, validate(exported_classes_1.validator.updateState), (req, res, next) => exported_classes_1.adminCtrl.updateState(req, res, next));
Router.put('/town', auth_middleware_1.adminMiddleware, validate(exported_classes_1.validator.updateTown), (req, res, next) => exported_classes_1.adminCtrl.updateTown(req, res, next));
Router.delete('/state', auth_middleware_1.adminMiddleware, validate(exported_classes_1.validator.deleteWithId), (req, res, next) => exported_classes_1.adminCtrl.deleteState(req, res, next));
Router.delete('/town', auth_middleware_1.adminMiddleware, validate(exported_classes_1.validator.deleteWithId), (req, res, next) => exported_classes_1.adminCtrl.deleteState(req, res, next));
module.exports = Router;

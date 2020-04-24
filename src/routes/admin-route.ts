import express from 'express'
const Router = express.Router()
import { adminMiddleware, superAdminMiddleware } from '../middleware/auth-middleware'
import { adminCtrl, validator, jobCtrl, agentCtrl, searchCtrl } from './../app/exported.classes'

const validate = validator.validate;

/* Get all admins on our system */
Router.post('/', superAdminMiddleware, validate(validator.newAdmin), (req, res, next) => adminCtrl.create(req, res, next))
Router.post('/login', validate(validator.adminloginData), (req, res, next) => adminCtrl.login(req, res, next))
Router.get('/all', superAdminMiddleware, (req, res, next) => adminCtrl.allAdmins(req, res, next))
Router.get('/one/:id', superAdminMiddleware, (req, res, next) => adminCtrl.oneAdmin(req, res, next));
Router.put('/self', adminMiddleware, validate(validator.updateAdmin), (req, res, next) => adminCtrl.update(req, res, next))
Router.put('/super', superAdminMiddleware, validate(validator.updateAdminSuper), (req, res, next) => adminCtrl.updateSuper(req, res, next))
Router.delete('/', superAdminMiddleware, validate(validator.deleteWithId), (req, res, next) => adminCtrl.delete(req, res, next))

/* Get all agents on our system so far - User and Workers */
Router.get('/agents', adminMiddleware, (req, res, next) => agentCtrl.allAgents(req, res, next))

/* Load more - All agents on our system so far - User and Workers */
Router.post('/agents-more', adminMiddleware,  validate(validator.allLoadMore), (req, res, next) => agentCtrl.allAgentsMore(req, res, next))

/** All the jobs so far on our app */
Router.get('/jobs', adminMiddleware, (req, res, next) => jobCtrl.getAllJobsForAdmin(req, res, next))

/** Load more - All the jobs so far on our app */
Router.post('/jobs-more', validate(validator.allLoadMore), (req, res, next) => jobCtrl.getAllJobsMoreForAdmin(req, res, next))

/** Get all jobs from a particular state or town with date range */
Router.post('/job-chart', adminMiddleware, validate(validator.jobsByStatusFrom), (req, res, next) => jobCtrl.jobsByStatusFromStateOrTownForAdmin(req, res, next))

/** Get a particular job type from a particular state or town with date range */
Router.post('/a-job-chart', adminMiddleware, validate(validator.jobWithTitleByStatusFrom), (req, res, next) => jobCtrl.jobsByTitleStatusFromStateOrTownForAdmin(req, res, next))

/** All searches so far on our app */
Router.get('/searches',  adminMiddleware, (req, res, next) => searchCtrl.allSearches(req, res, next))

/** Load more - All searches so far on our app */
Router.post('/searches-more', adminMiddleware, validate(validator.allLoadMore), (req, res, next) => searchCtrl.allSearchesMore(req, res, next))

/** Get search histories from everywhere or a particular state or town with date range */
Router.post('/search-chart', adminMiddleware, validate(validator.searchHistoryByKey), (req, res, next) => searchCtrl.searchesForAdmin(req, res, next))

/** Create many states at once */
Router.post('/states', adminMiddleware,  validate(validator.newManyStates), (req, res, next) => adminCtrl.createManyStates(req, res, next))
/** Create many towns at once */
Router.post('/towns', adminMiddleware,  validate(validator.newManyTowns), (req, res, next) => adminCtrl.createManyTowns(req, res, next))

/** Create a state at once */
Router.post('/state', adminMiddleware, validate(validator.newState), (req, res, next) => adminCtrl.createState(req, res, next))
/** Create a town at once */
Router.post('/town', adminMiddleware, validate(validator.newTown), (req, res, next) => adminCtrl.createTown(req, res, next))

Router.put('/state', adminMiddleware, validate(validator.updateState), (req, res, next) => adminCtrl.updateState(req, res, next))
Router.put('/town', adminMiddleware, validate(validator.updateTown), (req, res, next) => adminCtrl.updateTown(req, res, next))

Router.delete('/state', adminMiddleware, validate(validator.deleteWithId), (req, res, next) => adminCtrl.deleteState(req, res, next))
Router.delete('/town', adminMiddleware, validate(validator.deleteWithId), (req, res, next) => adminCtrl.deleteState(req, res, next))

module.exports = Router

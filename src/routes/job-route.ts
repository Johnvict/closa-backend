import express from 'express'
const Router = express.Router()
import { agentMiddleware } from '../middleware/auth-middleware'
import { jobCtrl, validator } from './../app/exported.classes'

const validate = validator.validate;

Router.post('/', agentMiddleware, validate(validator.newJob), (req, res, next) => jobCtrl.create(req, res, next))

/* Load more jobs */
Router.post('/more', agentMiddleware, validate(validator.loadMoreJobs), (req, res, next) => jobCtrl.getMore(req, res, next))
Router.get('/all', (req, res, next) => jobCtrl.getAllJobs(req, res, next))

/** Get all jobs from a particular state or town with date range */
Router.post('/search-all-record', agentMiddleware, validate(validator.jobsByStatusFrom), (req, res, next) => jobCtrl.jobsByStatusFrom(req, res, next))

/** Get a particular job type from a particular state or town with date range */
Router.post('/search-a-job', agentMiddleware, validate(validator.jobWithTitleByStatusFrom), (req, res, next) => jobCtrl.jobsStatusWithTitleFrom(req, res, next))

/* Update job */
Router.put('/', agentMiddleware, validate(validator.updateJob), (req, res, next) => jobCtrl.update(req, res, next))


module.exports = Router

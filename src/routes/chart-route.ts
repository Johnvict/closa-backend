import express from 'express'
const Router = express.Router()
import { agentMiddleware } from '../middleware/auth-middleware'
import { jobCtrl, validator, searchCtrl } from './../app/exported.classes'

const validate = validator.validate;

/** Get all jobs from a particular state or town with date range */
Router.post('/jobs', agentMiddleware, validate(validator.jobsByStatusFrom), (req, res, next) => jobCtrl.jobsByStatusFromStateOrTown(req, res, next))

/** Get a particular job type from a particular state or town with date range */
Router.post('/a-job', agentMiddleware, validate(validator.jobWithTitleByStatusFrom), (req, res, next) => jobCtrl.jobsByTitleTitleStatusFromStateOrTown(req, res, next))

/** Get a particular job type from a particular state or town with date range */
Router.post('/a-job', agentMiddleware, validate(validator.jobWithTitleByStatusFrom), (req, res, next) => jobCtrl.jobsByTitleTitleStatusFromStateOrTown(req, res, next))

/** Get search history from everywhere or a particular state or town with date range */
Router.post('/search-history', agentMiddleware, validate(validator.searchHistoryByKey), (req, res, next) => searchCtrl.searchesForChart(req, res, next))

/* Update job */
Router.put('/', agentMiddleware, validate(validator.updateJob), (req, res, next) => jobCtrl.update(req, res, next))


module.exports = Router

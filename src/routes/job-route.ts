import express from 'express'
const Router = express.Router()
import { agentMiddleware } from '../middleware/auth-middleware'
import { jobCtrl, validator } from './../app/exported.classes'

const validate = validator.validate;

Router.post('/', agentMiddleware, validate(validator.newJob), (req, res, next) => jobCtrl.create(req, res, next))

/* Load more jobs for a particular agent.  We sent 10 on login */
Router.post('/more', agentMiddleware, validate(validator.loadMoreJobs), (req, res, next) => jobCtrl.getMore(req, res, next))

/* Update job */
Router.put('/', agentMiddleware, validate(validator.updateJob), (req, res, next) => jobCtrl.update(req, res, next))


module.exports = Router

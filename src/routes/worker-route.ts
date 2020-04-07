import express from 'express'
const Router = express.Router()
import { agentMiddleware } from '../middleware/agent-middleware'
import { workerCtrl, validator } from './../app/exported.classes'

const validate = validator.validate;

/* Create new worker business profile */
Router.post('/', agentMiddleware, validate(validator.newWorker), (req, res) => workerCtrl.create(req, res))

/* Update worker business profile */
Router.put('/', agentMiddleware, validate(validator.updateUser), (req, res) => workerCtrl.update(req, res))

module.exports = Router

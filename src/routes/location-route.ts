import express from 'express'
const Router = express.Router()
import { agentMiddleware } from '../middleware/auth-middleware'
import { locationCtrl, validator, fileCtrl } from './../app/exported.classes'

const validate = validator.validate;

/* Create new agent location */
Router.post('/', agentMiddleware, validate(validator.newLocation), (req, res, next) => locationCtrl.create(req, res, next))

/* Update location */
Router.put('/', agentMiddleware, validate(validator.updateLocation),  (req, res, next) => locationCtrl.update(req, res, next))
// Router.put('/', agentMiddleware, validate(validator.updateLocation), fileCtrl.uploadFile('location'), fileCtrl.resizeLocation, (req, res, next) => locationCtrl.update(req, res, next))

/* Get states */
Router.get('/states', agentMiddleware,  (req, res, next) => locationCtrl.states(req, res, next))

/* Get state towns */
Router.get('/state-towns/:stateId', agentMiddleware,  (req, res, next) => locationCtrl.towns(req, res, next))
module.exports = Router

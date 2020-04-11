import express from 'express'
const Router = express.Router()
import { agentMiddleware } from '../middleware/auth-middleware'
import { locationCtrl, validator, fileCtrl } from './../app/exported.classes'

const validate = validator.validate;

/* Create new agent location */
Router.post('/', agentMiddleware, validate(validator.newLocation), (req, res, next) => locationCtrl.create(req, res, next))

/* Update location */
Router.put('/', agentMiddleware, validate(validator.updateLocation), fileCtrl.uploadFile('location'), fileCtrl.resizeLocation, (req, res, next) => locationCtrl.update(req, res, next))

module.exports = Router

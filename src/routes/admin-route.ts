import express from 'express'
const Router = express.Router()
import { adminMiddleware } from '../middleware/auth-middleware'
import { adminCtrl, validator, fileCtrl, agentCtrl } from './../app/exported.classes'

const validate = validator.validate;

/* Create new user */
Router.get('/agents', /* adminMiddleware, validate(validator.newState), */ (req, res, next) => agentCtrl.allAgents(req, res, next))

Router.post('/states', /* adminMiddleware, */ validate(validator.newManyStates), (req, res, next) => adminCtrl.createManyStates(req, res, next))
Router.post('/towns', /* adminMiddleware, */ validate(validator.newManyTowns), (req, res, next) => adminCtrl.createManyTowns(req, res, next))

Router.post('/state', /* adminMiddleware, validate(validator.newState), */ (req, res, next) => adminCtrl.createState(req, res, next))
Router.post('/town', /* adminMiddleware, validate(validator.newTown), */ (req, res, next) => adminCtrl.createTown(req, res, next))

Router.put('/state', /* adminMiddleware, validate(validator.updateState), */ (req, res, next) => adminCtrl.updateState(req, res, next))
Router.put('/town', /* adminMiddleware, validate(validator.updateTown), */ (req, res, next) => adminCtrl.updateTown(req, res, next))

Router.delete('/state', /* adminMiddleware, validate(validator.deleteWithId), */ (req, res, next) => adminCtrl.deleteState(req, res, next))
Router.delete('/town', /* adminMiddleware, validate(validator.deleteWithId), */ (req, res, next) => adminCtrl.deleteState(req, res, next))

module.exports = Router

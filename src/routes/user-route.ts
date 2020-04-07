import express from 'express'
const Router = express.Router()
import { agentMiddleware } from '../middleware/agent-middleware'
import { userCtrl, validator } from './../app/exported.classes'

const validate = validator.validate;

/* Create new user */
Router.post('/', agentMiddleware, validate(validator.newUser), (req, res) => userCtrl.create(req, res))

/* Update user */
Router.put('/', agentMiddleware, validate(validator.updateUser), (req, res) => userCtrl.update(req, res))

module.exports = Router

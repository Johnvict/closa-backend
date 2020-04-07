import express from 'express'
const Router = express.Router()
import { agentMiddleware } from '../middleware/agent-middleware'
import { agentCtrl, validator } from './../app/exported.classes'

const validate = validator.validate;

/* Create new agent phone */
Router.post('/new', validate(validator.newAccount), (req, res) => agentCtrl.create(req, res))

/** Continue new account to create agent other data*/
Router.post('/continue', validate(validator.newAgent), (req, res) => agentCtrl.update(req, res))

/* Update user */
Router.put('/', agentMiddleware, validate(validator.updateAgent), (req, res) => agentCtrl.update(req, res))

/* Delete user */
Router.delete('/', agentMiddleware, (req, res) => agentCtrl.delete(req, res))

/* Update user password */
Router.put('/password', agentMiddleware, validate(validator.updatePasswordStruct), (req, res) => agentCtrl.changePassword(req, res))

/* Authenticate user */
Router.post('/login', validate(validator.loginData), (req, res) => agentCtrl.login(req, res))

module.exports = Router
import express from 'express'
const Router = express.Router()
import { userMiddleware } from './../middleware/user-middleware'
import { userCtrl, validator, auth } from './../app/exported.classes'

const validate = validator.validate;
// Router.post('/val', validate(validator.phone), (req, res, next) => res.send('Welcome to user. Kinly make a valid request'))

Router.get('/all', userMiddleware, (req, res) => userCtrl.allUsers(req, res))

Router.post('/', validate(validator.newUserStruct), (req, res) => userCtrl.createUser(req, res))

Router.put('/', userMiddleware, (req, res) => userCtrl.updateUser(req, res))

Router.delete('/', userMiddleware, (req, res) => userCtrl.deleteUser(req, res))

Router.put('/password', userMiddleware, validate(validator.updatePasswordStruct), (req, res) => userCtrl.changePassword(req, res))

Router.post('/login', validate(validator.loginData), (req, res) => userCtrl.login(req, res))

module.exports = Router
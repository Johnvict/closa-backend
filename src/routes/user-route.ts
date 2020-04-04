import express from 'express'
const Router = express.Router()
import { userMiddleware } from './../middleware/user-middleware'
import { userCtrl, validator } from './../app/exported.classes'

const validate = validator.validate;
// Router.post('/val', validate(validator.phone), (req, res, next) => res.send('Welcome to user. Kinly make a valid request'))
// Router.get('/all', userMiddleware, (req, res) => userCtrl.allUsers(req, res))


/* Create new user */
Router.post('/', validate(validator.newUserStruct), (req, res) => userCtrl.createUser(req, res))

/* Update user */
Router.put('/', userMiddleware, (req, res) => userCtrl.updateUser(req, res))

/* Delete user */
Router.delete('/', userMiddleware, (req, res) => userCtrl.deleteUser(req, res))

/* Update user password */
Router.put('/password', userMiddleware, validate(validator.updatePasswordStruct), (req, res) => userCtrl.changePassword(req, res))

/* Authenticate user */
Router.post('/login', validate(validator.loginData), (req, res) => userCtrl.login(req, res))

module.exports = Router
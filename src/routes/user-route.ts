import express from 'express'
const Router = express.Router()
import { userMiddleware } from '../middleware/auth-middleware'
import { userCtrl, validator, fileCtrl } from './../app/exported.classes'

const validate = validator.validate;

/* Create new user */
Router.post('/', userMiddleware, validate(validator.newUser), (req, res, next) => userCtrl.create(req, res, next))

/* Update user */
Router.put('/', userMiddleware, validate(validator.updateUser), fileCtrl.uploadFile('avatar'), fileCtrl.resizeAvatar, (req, res, next) => userCtrl.update(req, res, next))

module.exports = Router

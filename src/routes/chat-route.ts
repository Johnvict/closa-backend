import express from 'express'
const Router = express.Router()
import { userMiddleware } from './../middleware/user-middleware'
import { chatCtrl, validator, auth } from './../app/exported.classes'

const validate = validator.validate;

Router.get('/one/:_id', userMiddleware, (req, res) => chatCtrl.getOneConversation(req, res))
Router.get('/all', userMiddleware, (req, res) => chatCtrl.allConversations(req, res))

Router.post('/', userMiddleware, validate(validator.newConversation), (req, res) => chatCtrl.createConversation(req, res))
Router.post('/message', userMiddleware, validate(validator.newMessageStruct), (req, res) => chatCtrl.createNewMessage(req, res))

Router.put('/message', userMiddleware, (req, res) => chatCtrl.updateMessage(req, res))

Router.delete('/message', userMiddleware, (req, res) => chatCtrl.deleteMessage(req, res))

module.exports = Router
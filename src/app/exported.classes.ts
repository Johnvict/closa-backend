// import { ChatController } from './../controllers/chatController'
import { UserController } from './../controllers/userController'
import { UserModel } from "./../models/user";
import { Authorization } from './../middleware/authorization'
import { Validator } from './../middleware/validator'

export const sequelize = require('./connection')

/** 
 * ! Controllers import for export */
// export const chatCtrl = new ChatController();
export const userCtrl = new UserController();

/**
 * ! Model import for exports */
export const userModel = new UserModel();

/** 
 * ! Middleware exports */
export const auth = new Authorization();
export const validator = new Validator();

/** 
 * ! Standalone methods */
export const formatError = validator.formatError;

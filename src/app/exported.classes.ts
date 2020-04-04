// import { ChatController } from './../controllers/chatController'
import { UserController } from './../controllers/userController'
import { UserModel } from "./../models/user";
import { Authorization } from './../middleware/authorization'
import { Validator } from './../middleware/validator'


/**
 * ! Db model classes..
 * ? We don't want to import them in each place we're gonna be needing them
 */
export const DbModel = {
	Agent: require('./../models/definition/Agent'),
	File: require('./../models/definition/File'),
	Job: require('./../models/definition/Job'),
	JobSample: require('./../models/definition/JobSample'),
	State: require('./../models/definition/State'),
	Town: require('./../models/definition/Town'),
	Location: require('./../models/definition/Location'),
	SearchHistory: require('./../models/definition/SearchHistory'),
	User: require('./../models/definition/User'),
	Worker: require('./../models/definition/Worker')
};

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

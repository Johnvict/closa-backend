import { TokenModel } from './../models/token';
import { AdminController } from './../controllers/admin/adminController';
// import { ChatController } from './../controllers/chatController'
import { AgentController } from './../controllers/agentController'
import { FileController } from './../controllers/fileController'
import { JobController } from '../controllers/jobController';
import { LocationController } from '../controllers/locationController';
import { UserController } from './../controllers/userController'
import { WorkerController } from './../controllers/workerController'
import { SearchController } from './../controllers/searchController'

import { UserModel } from "./../models/user";
import { AgentModel } from "./../models/agent";
import { WorkerModel } from "./../models/worker";
import { JobSampleModel } from "./../models/job-sample";
import { LocationModel } from './../models/location';
import { TownModel } from '../models/town';
import { StateModel } from '../models/state';
import { JobModel } from '../models/job';
import { SearchModel } from '../models/search';

import { Authorization } from './../middleware/authorization'
import { Validator } from './../middleware/validator'
import { AppError as appError } from './../misc/app.error'
import { makeAPICall } from './../misc/api-caller'
import { convertToDistance } from './../misc/helper-functions'
export const AppError = appError; 
export const catchAsync = require('./../misc/catchAsync');

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
	Worker: require('./../models/definition/Worker'),
	Token: require('./../models/definition/Token')
};

export const sequelize = require('./connection')

/** 
 * ! Controllers import for export */
// export const chatCtrl = new ChatController();
export const adminCtrl = new AdminController();
export const userCtrl = new UserController();
export const workerCtrl = new WorkerController();
export const agentCtrl = new AgentController();
export const fileCtrl = new FileController();
export const locationCtrl = new LocationController();
export const jobCtrl = new JobController();
export const searchCtrl = new SearchController();
/**
 * ! Model import for exports */
export const agentModel = new AgentModel();
export const userModel = new UserModel();
export const workerModel = new WorkerModel();
export const jobSampleModel = new JobSampleModel();
export const locationModel = new LocationModel();
export const townModel = new TownModel();
export const stateModel = new StateModel();
export const jobModel = new JobModel();
export const searchModel = new SearchModel();
export const tokenModel = new TokenModel();

/** 
 * ! Middleware exports */
export const auth = new Authorization();
export const validator = new Validator();

/** 
 * ! Standalone methods */
export const formatError = validator.formatError;
export const apiCaller = makeAPICall;
export const distanceCalculator = convertToDistance;
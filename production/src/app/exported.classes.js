"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("./../models/token");
const adminController_1 = require("./../controllers/admin/adminController");
// import { ChatController } from './../controllers/chatController'
const agentController_1 = require("./../controllers/agentController");
const fileController_1 = require("./../controllers/fileController");
const jobController_1 = require("../controllers/jobController");
const locationController_1 = require("../controllers/locationController");
const userController_1 = require("./../controllers/userController");
const workerController_1 = require("./../controllers/workerController");
const searchController_1 = require("./../controllers/searchController");
const user_1 = require("./../models/user");
const agent_1 = require("./../models/agent");
const worker_1 = require("./../models/worker");
const job_sample_1 = require("./../models/job-sample");
const location_1 = require("./../models/location");
const town_1 = require("../models/town");
const state_1 = require("../models/state");
const job_1 = require("../models/job");
const search_1 = require("../models/search");
const authorization_1 = require("./../middleware/authorization");
const validator_1 = require("./../middleware/validator");
const app_error_1 = require("./../misc/app.error");
const api_caller_1 = require("./../misc/api-caller");
const helper_functions_1 = require("./../misc/helper-functions");
exports.AppError = app_error_1.AppError;
exports.catchAsync = require('./../misc/catchAsync');
/**
 * ! Db model classes..
 * ? We don't want to import them in each place we're gonna be needing them
 */
exports.DbModel = {
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
exports.sequelize = require('./connection');
/**
 * ! Controllers import for export */
// export const chatCtrl = new ChatController();
exports.adminCtrl = new adminController_1.AdminController();
exports.userCtrl = new userController_1.UserController();
exports.workerCtrl = new workerController_1.WorkerController();
exports.agentCtrl = new agentController_1.AgentController();
exports.fileCtrl = new fileController_1.FileController();
exports.locationCtrl = new locationController_1.LocationController();
exports.jobCtrl = new jobController_1.JobController();
exports.searchCtrl = new searchController_1.SearchController();
/**
 * ! Model import for exports */
exports.agentModel = new agent_1.AgentModel();
exports.userModel = new user_1.UserModel();
exports.workerModel = new worker_1.WorkerModel();
exports.jobSampleModel = new job_sample_1.JobSampleModel();
exports.locationModel = new location_1.LocationModel();
exports.townModel = new town_1.TownModel();
exports.stateModel = new state_1.StateModel();
exports.jobModel = new job_1.JobModel();
exports.searchModel = new search_1.SearchModel();
exports.tokenModel = new token_1.TokenModel();
/**
 * ! Middleware exports */
exports.auth = new authorization_1.Authorization();
exports.validator = new validator_1.Validator();
/**
 * ! Standalone methods */
exports.formatError = exports.validator.formatError;
exports.apiCaller = api_caller_1.makeAPICall;
exports.distanceCalculator = helper_functions_1.convertToDistance;

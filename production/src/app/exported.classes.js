"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { ChatController } from './../controllers/chatController'
const userController_1 = require("./../controllers/userController");
const agentController_1 = require("./../controllers/agentController");
const user_1 = require("./../models/user");
const agent_1 = require("./../models/agent");
const workerController_1 = require("./../controllers/workerController");
const worker_1 = require("./../models/worker");
const authorization_1 = require("./../middleware/authorization");
const validator_1 = require("./../middleware/validator");
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
    Worker: require('./../models/definition/Worker')
};
exports.sequelize = require('./connection');
/**
 * ! Controllers import for export */
// export const chatCtrl = new ChatController();
exports.userCtrl = new userController_1.UserController();
exports.workerCtrl = new workerController_1.WorkerController();
exports.agentCtrl = new agentController_1.AgentController();
/**
 * ! Model import for exports */
exports.agentModel = new agent_1.AgentModel();
exports.userModel = new user_1.UserModel();
exports.workerModel = new worker_1.WorkerModel();
/**
 * ! Middleware exports */
exports.auth = new authorization_1.Authorization();
exports.validator = new validator_1.Validator();
/**
 * ! Standalone methods */
exports.formatError = exports.validator.formatError;

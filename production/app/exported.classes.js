"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var userController_1 = require("./../controllers/userController");
var user_1 = require("./../models/user");
var authorization_1 = require("./../middleware/authorization");
var validator_1 = require("./../middleware/validator");
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
exports.userCtrl = new userController_1.UserController();
exports.userModel = new user_1.UserModel();
exports.auth = new authorization_1.Authorization();
exports.validator = new validator_1.Validator();
exports.formatError = exports.validator.formatError;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Router = express_1.default.Router();
const auth_middleware_1 = require("../middleware/auth-middleware");
const exported_classes_1 = require("./../app/exported.classes");
const validate = exported_classes_1.validator.validate;
/* ? Create new worker business profile */
Router.post('/', auth_middleware_1.workerMiddleware, validate(exported_classes_1.validator.newWorker), (req, res, next) => exported_classes_1.workerCtrl.create(req, res, next));
/* ? Create new job sample for business */
Router.post('/job-sample', auth_middleware_1.workerMiddleware, validate(exported_classes_1.validator.newJobSample), (req, res, next) => exported_classes_1.workerCtrl.createJobSample(req, res, next));
/* ? Deletes job sample for business */
Router.delete('/job-sample', auth_middleware_1.workerMiddleware, validate(exported_classes_1.validator.deleteWithId), (req, res, next) => exported_classes_1.workerCtrl.deleteJobSample(req, res, next));
/* ? Update worker business profile */
Router.put('/', auth_middleware_1.workerMiddleware, validate(exported_classes_1.validator.updateWorker), exported_classes_1.fileCtrl.uploadFile('logo'), exported_classes_1.fileCtrl.resizeLogo, (req, res) => exported_classes_1.workerCtrl.update(req, res));
/** ? Uploads job sample file.. It actually updates the job file table after file is stored */
Router.post('/job-sample-file/:job_sample_id/:id', auth_middleware_1.workerMiddleware, validate(exported_classes_1.validator.jobSampleFile), exported_classes_1.fileCtrl.uploadFile('file'), (req, res, next) => exported_classes_1.workerCtrl.updateFileLink(req, res, next));
module.exports = Router;

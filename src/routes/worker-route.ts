import express from 'express'
const Router = express.Router()
import { workerMiddleware } from '../middleware/auth-middleware'
import { workerCtrl, validator, fileCtrl } from './../app/exported.classes'

const validate = validator.validate;

/* ? Create new worker business profile */
Router.post('/', workerMiddleware, validate(validator.newWorker), (req, res, next) => workerCtrl.create(req, res, next))

/* ? Create new job sample for business */
Router.post('/job-sample', workerMiddleware, validate(validator.newJobSample), (req, res, next) => workerCtrl.createJobSample(req, res, next))

/* ? Deletes job sample for business */
Router.delete('/job-sample', workerMiddleware, validate(validator.deleteWithId), (req, res, next) => workerCtrl.deleteJobSample(req, res, next))

/* ? Update worker business profile */
Router.put('/', workerMiddleware, validate(validator.updateWorker), fileCtrl.uploadFile('logo'), fileCtrl.resizeLogo, (req, res) => workerCtrl.update(req, res))

/** ? Uploads job sample file.. It actually updates the job file table after file is stored */
Router.post('/job-sample-file/:job_sample_id/:id', workerMiddleware, validate(validator.jobSampleFile), fileCtrl.uploadFile('file'), (req, res, next) => workerCtrl.updateFileLink(req, res, next))

module.exports = Router

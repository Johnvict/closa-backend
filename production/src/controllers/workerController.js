"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const exported_classes_1 = require("./../app/exported.classes");
class WorkerController {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            exported_classes_1.workerModel.create(Object.assign(Object.assign({}, req.body), { agent_id: req.agent.id })).then(response => {
                return response.exist ?
                    res.status(200).json({ status: -1, data: response.data, exist: true }) :
                    res.status(201).json({ status: 1, data: response.data });
            });
        });
    }
    createJobSample(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.agent.otherid) {
                const business = yield exported_classes_1.workerModel.findOneWithFilter({ agent_id: req.agent.id });
                if (business)
                    req.agent.otherid = business.id;
                else
                    return res.status(400).json({ status: -1, message: 'You cannot create job sample without a business profile' });
            }
            exported_classes_1.jobSampleModel.create(next, Object.assign(Object.assign({}, req.body), { worker_id: req.agent.otherid })).then(response => {
                if (response) {
                    res.status(201).json({ status: 1, data: response });
                }
            });
        });
    }
    updateFileLink(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const whatToSave = {
                url: req.body.fileUrl,
                id: req.params.id,
                job_sample_id: req.params.job_sample_id
            };
            exported_classes_1.jobSampleModel.saveFileLink(next, whatToSave).then(response => {
                return response ?
                    res.status(200).json({ status: 1, data: response }) :
                    res.status(400).json({ status: -1, message: 'error updating file url' });
            });
        });
    }
    deleteJobSample(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            exported_classes_1.jobSampleModel.delete(next, req.body.id).then(response => {
                if (response) {
                    res.status(201).json({ status: 1, data: 'job sample deleted successfully' });
                }
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            exported_classes_1.workerModel.update(Object.assign(Object.assign({}, req.body), { agent_id: req.agent.id })).then(response => {
                return response ?
                    res.status(200).json({ status: 1, data: response }) :
                    res.status(400).json({ status: -1, message: 'error updating business profile' });
            });
        });
    }
}
exports.WorkerController = WorkerController;

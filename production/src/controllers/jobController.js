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
class JobController {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isThisAgentAllowed(req, res, next, 'create')) {
                const data = yield exported_classes_1.jobModel.create(next, req.body);
                if (data)
                    return res.status(201).json({ status: 1, data });
            }
        });
    }
    getMore(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isThisAgentAllowed(req, res, next, 'access')) {
                const data = yield exported_classes_1.jobModel.getMore({ page: req.body.page, user_id: req.body.user_id, worker_id: req.body.worker_id });
                if (data)
                    return res.status(200).json(Object.assign({ status: 1 }, data));
            }
        });
    }
    jobsByStatusFrom(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield exported_classes_1.jobModel.jobsStatusFrom(req.body);
            if (data)
                return res.status(200).json(Object.assign({ status: 1 }, data));
        });
    }
    jobsStatusWithTitleFrom(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield exported_classes_1.jobModel.jobsStatusWithTitleFrom(req.body);
            if (data)
                return res.status(200).json(Object.assign({ status: 1 }, data));
        });
    }
    getAllJobs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield exported_classes_1.jobModel.getAll();
            if (data)
                return res.status(200).json(Object.assign({ status: 1 }, data));
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.table(req.body);
            // if (await this.isThisAgentAllowed(req, res, next, 'update')) {
            const data = yield exported_classes_1.jobModel.update(next, req.body);
            if (data)
                return res.status(200).json({ status: 1, data });
            // }
        });
    }
    isThisAgentAllowed(req, res, next, action) {
        const thisLogedInId = req.agent.id;
        if (req.body.user_id !== thisLogedInId && req.body.worker_id !== thisLogedInId)
            return next(new exported_classes_1.AppError(`Access denied, you cannot ${action} this job with this account`, 401, -1));
        return true;
    }
}
exports.JobController = JobController;

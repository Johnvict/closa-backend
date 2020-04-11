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
const app_error_1 = require("./../misc/app.error");
const exported_classes_1 = require("./../app/exported.classes");
const Op = require('sequelize').Op;
class JobSampleModel {
    constructor() {
        this.jobSampleRelation = [
            { model: exported_classes_1.DbModel.File, as: 'file' }
        ];
    }
    create(next, newSample) {
        return __awaiter(this, void 0, void 0, function* () {
            return exported_classes_1.DbModel.JobSample.findOrCreate({
                where: { [Op.and]: [{ worker_id: newSample.worker_id }, { title: newSample.title }] },
                defaults: { date_done: newSample.date_done, title: newSample.title, worker_id: newSample.worker_id }
            }).then((queryRes) => __awaiter(this, void 0, void 0, function* () {
                if (queryRes[1]) {
                    console.log(queryRes[1]);
                    yield this.createFile({
                        job_sample_id: queryRes[0].id,
                        name: queryRes[0].title,
                        url: newSample.link,
                        type: newSample.type,
                    });
                    return yield this.getOne(next, queryRes[0].id);
                }
                return next(new app_error_1.AppError('you already have a job sample with this title', 400, -1));
            })).catch(e => console.log(e));
        });
    }
    createFile(newFile) {
        return __awaiter(this, void 0, void 0, function* () {
            return exported_classes_1.DbModel.File.findOrCreate({
                where: { [Op.and]: [{ job_sample_id: newFile.job_sample_id }, { name: newFile.name }] },
                defaults: newFile
            }).catch(e => console.log(e));
        });
    }
    saveFileLink(next, whatToSave) {
        return __awaiter(this, void 0, void 0, function* () {
            return exported_classes_1.DbModel.File.update({ url: whatToSave.url }, { returning: true, where: { id: whatToSave.id } })
                .then((queryRes) => __awaiter(this, void 0, void 0, function* () {
                return queryRes ? yield this.getOne(next, whatToSave.job_sample_id) : false;
            })).catch(e => console.log(e));
        });
    }
    getOne(next, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield exported_classes_1.DbModel.JobSample.findByPk(id, { include: this.jobSampleRelation });
                return data ? data : next(new app_error_1.AppError('no job sample found with this credential', 500));
            }
            catch (err) {
                return next(err.message);
            }
        });
    }
    delete(next, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                exported_classes_1.DbModel.JobSample.destroy({ where: { id } }).then(data => {
                    return data < 1 ? next(new app_error_1.AppError('data not found', 400, -1)) : true;
                });
            }
            catch (err) {
                return next(err.message);
            }
        });
    }
    findOneWithFilter(filterArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exported_classes_1.DbModel.JobSample.findOne({ where: filterArgs });
        });
    }
}
exports.JobSampleModel = JobSampleModel;

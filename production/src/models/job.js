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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const exported_classes_1 = require("./../app/exported.classes");
const sequelize = __importStar(require("sequelize"));
const Op = sequelize.Op;
class JobModel {
    constructor() {
        this.jobRelations = [this.getUserWorkerRelation('user'), this.getUserWorkerRelation('worker')];
    }
    getUserWorkerRelation(who) {
        return {
            model: exported_classes_1.DbModel.Agent, as: who,
            include: [
                { model: who == 'user' ? exported_classes_1.DbModel.User : exported_classes_1.DbModel.Worker, as: who == 'user' ? 'profile' : 'business', },
                {
                    model: exported_classes_1.DbModel.Location, as: 'location', include: [
                        { model: exported_classes_1.DbModel.State, as: 'state' },
                        { model: exported_classes_1.DbModel.Town, as: 'town' }
                    ]
                }
            ]
        };
    }
    create(next, newJob) {
        return __awaiter(this, void 0, void 0, function* () {
            const titleQueryCaseInsensitive = sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', `%${newJob.title}%`);
            const [job, created] = yield exported_classes_1.DbModel.Job.findOrCreate({
                where: {
                    [Op.and]: [
                        { worker_id: newJob.worker_id },
                        { user_id: newJob.user_id },
                        titleQueryCaseInsensitive,
                        { start: null },
                        { amount: null },
                        { status: 'pending' } // ? It's even pending
                    ] // ! My brother, don't bother creating another one, let them use this redundant one
                },
                defaults: newJob
            });
            if (created)
                return yield this.getOne(next, job.id);
            return job;
        });
    }
    getOne(next, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exported_classes_1.DbModel.Job.findByPk(id, { include: this.jobRelations });
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exported_classes_1.DbModel.Job.findAll({ include: this.jobRelations });
        });
    }
    getMore(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return exported_classes_1.DbModel.Job.findAndCountAll({
                where: {
                    [Op.and]: [
                        { worker_id: query.worker_id },
                        { user_id: query.user_id },
                        { status: { [Op.ne]: 'cancelled' } }
                    ]
                },
                order: [['updatedAt', 'DESC']],
                limit: 10,
                offset: 10 * query.page
            }).then(result => {
                const pageIncMonitor = (query.page + 2) * 10;
                const isLastPageNoMore = result.count >= pageIncMonitor ? false : true;
                return { data: result.rows, total: result.count, lastPage: isLastPageNoMore, more: !isLastPageNoMore };
            });
        });
    }
    formatIntoQueryArray(arr) {
        return arr.map(str => {
            str = this.formatStringToFitRegExcape(str);
            const query = { [Op.regexp]: `.*${str}.*` };
            return query;
        });
    }
    formatStringToFitRegExcape(theStr) {
        return theStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    convertTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const skips = ["and", "or", "with", "on", "of", "for", "under", "across", "&", "in", "an"];
            const arr = title.split(' ');
            yield skips.forEach(el => {
                const ind = arr.indexOf(el);
                if (ind >= 0)
                    arr.splice(ind, 1);
                const indexOfNull = arr.indexOf("");
                if (indexOfNull >= 0)
                    arr.splice(indexOfNull, 1);
            });
            return arr;
        });
    }
    jobsStatusWithTitleFrom(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchKeys = yield this.convertTitle(filter.title);
            const filterArg = yield this.formatIntoQueryArray(searchKeys);
            return exported_classes_1.DbModel.Job.findAndCountAll({
                where: {
                    [Op.and]: [
                        { createdAt: { [Op.between]: [filter.start_range ? filter.start_range : 0, filter.end_range ? filter.end_range : Date.now()] } },
                        { title: { [Op.or]: filterArg } }
                    ]
                },
                include: {
                    model: exported_classes_1.DbModel.Agent, as: 'worker', required: true, include: {
                        model: exported_classes_1.DbModel.Location, as: 'location', required: true, where: { [`${filter.state_or_town}_id`]: filter.state_or_town_id }
                    }
                },
                group: ['status']
            }).then(result => {
                const total = result.count.map(el => el.count).reduce((sum, num) => sum + num, 0);
                const regroup = result.count.map(el => (Object.assign(Object.assign({}, el), { percent: (el.count / total) * 100 })));
                return { total, data: regroup };
            });
        });
    }
    jobsStatusFrom(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return exported_classes_1.DbModel.Job.findAndCountAll({
                where: {
                    createdAt: { [Op.between]: [filter.start_range ? filter.start_range : 0, filter.end_range ? filter.end_range : Date.now()] },
                },
                include: {
                    model: exported_classes_1.DbModel.Agent, as: 'worker', required: true, include: {
                        model: exported_classes_1.DbModel.Location, as: 'location', required: true, where: { [`${filter.state_or_town}_id`]: filter.state_or_town_id }
                    }
                },
                group: ['status']
            }).then(result => {
                const total = result.count.map(el => el.count).reduce((sum, num) => sum + num, 0);
                const regroup = result.count.map(el => (Object.assign(Object.assign({}, el), { percent: (el.count / total) * 100 })));
                return { total, data: regroup };
            });
        });
    }
    delete(next, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                exported_classes_1.DbModel.Job.destroy({ where: { id } }).then(data => {
                    return data < 1 ? next(new exported_classes_1.AppError('data not found', 400, -1)) : true;
                });
            }
            catch (err) {
                return next(err.message);
            }
        });
    }
    findOneWithFilter(next, filterArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield exported_classes_1.DbModel.Job.findOne({ where: filterArgs });
            return state ? state : next(new exported_classes_1.AppError('no job data found with this credential', 400, -1));
        });
    }
    whatToUpdate(data) {
        const newData = {};
        for (let key in data) {
            newData[key] = data[key];
        }
        return newData;
    }
    update(next, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataToStore = this.whatToUpdate(data);
            return exported_classes_1.DbModel.Job.update(dataToStore, { returning: true, where: { id: data.id } })
                .then((_) => __awaiter(this, void 0, void 0, function* () {
                return yield this.getOne(next, data.id);
            }))
                .catch(e => console.log(e));
        });
    }
}
exports.JobModel = JobModel;

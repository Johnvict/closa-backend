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
            return exported_classes_1.DbModel.Job.findAndCountAll({ order: [['updatedAt', 'DESC']], limit: 20, include: this.jobRelations }).then(result => {
                const isLastPageNoMore = result.count >= 20 ? false : true;
                return { total: result.count, lastPage: isLastPageNoMore, more: !isLastPageNoMore, data: result.rows };
            });
        });
    }
    getAllMore(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const sort = filter.sort ? filter.sort : 'desc';
            return exported_classes_1.DbModel.Job.findAndCountAll({
                order: [['updatedAt', sort]],
                limit: 20,
                offset: 20 * filter.page
            }).then(result => {
                const pageIncMonitor = (filter.page + 2) * 20;
                const isLastPageNoMore = result.count >= pageIncMonitor ? false : true;
                return { total: result.count, lastPage: isLastPageNoMore, more: !isLastPageNoMore, data: result.rows };
            });
        });
    }
    // ? Load more jobs for a user
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
                order: [['updatedAt', 'desc']],
                limit: 10,
                offset: 10 * query.page
            }).then(result => {
                const pageIncMonitor = (query.page + 2) * 10;
                const isLastPageNoMore = result.count >= pageIncMonitor ? false : true;
                return { data: result.rows, total: result.count, lastPage: isLastPageNoMore, more: !isLastPageNoMore };
            });
        });
    }
    jobsByTitleAndStatusFromStateOrTownForAdmin(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.loadJobsByTitleAndStatusFromStateOrTown(filter);
            const total = result.count.map(el => el.count).reduce((sum, num) => sum + num, 0);
            const pageIncMonitor = (filter.page + 1) * 20;
            const isLastPageNoMore = total >= pageIncMonitor ? false : true;
            const regroup = result.count.map(el => (Object.assign(Object.assign({}, el), { percent: (el.count / total) * 100 })));
            return { total, lastPage: isLastPageNoMore, more: !isLastPageNoMore, summary: regroup, data: result.rows, };
        });
    }
    jobsByTitleAndStatusFromStateOrTownForChart(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.loadJobsByTitleAndStatusFromStateOrTown(filter);
            const total = result.count.map(el => el.count).reduce((sum, num) => sum + num, 0);
            const regroup = result.count.map(el => (Object.assign(Object.assign({}, el), { percent: (el.count / total) * 100 })));
            return { total, data: regroup };
        });
    }
    loadJobsByTitleAndStatusFromStateOrTown(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterArg = exported_classes_1.formatIntoRegExQueryArray(filter.title);
            const sort = filter.sort ? filter.sort : 'desc';
            return exported_classes_1.DbModel.Job.findAndCountAll({
                where: {
                    [Op.and]: [
                        { createdAt: { [Op.between]: [filter.start_range ? filter.start_range : 0, filter.end_range ? filter.end_range : Date.now()] } },
                        { title: { [Op.or]: filterArg } }
                    ]
                },
                include: {
                    model: exported_classes_1.DbModel.Agent, as: 'worker',
                    required: filter.state_or_town == 'all' ? false : true,
                    include: {
                        model: exported_classes_1.DbModel.Location, as: 'location', required: true,
                        where: { [filter.state_or_town == 'all' ? 'state_id' : `${filter.state_or_town}_id`]: filter.state_or_town == 'all' ? { [Op.gt]: 0 } : filter.state_or_town_id }
                    }
                },
                order: [['updatedAt', sort]],
                limit: filter.page ? 20 : null,
                offset: filter.page ? 20 * (filter.page - 1) : null,
                group: [filter.grouped_by]
            });
        });
    }
    jobsBasedOnStatusFromStateOrTownForChart(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.loadJobsBasedOnStatusFromStateOrTown(filter);
            const total = result.count.map(el => el.count).reduce((sum, num) => sum + num, 0);
            const regroup = result.count.map(el => (Object.assign(Object.assign({}, el), { percent: (el.count / total) * 100 })));
            return { total, data: regroup };
        });
    }
    jobsBasedOnStatusFromStateOrTownForAdmin(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.loadJobsBasedOnStatusFromStateOrTown(filter);
            const total = result.count.map(el => el.count).reduce((sum, num) => sum + num, 0);
            const pageIncMonitor = (filter.page + 1) * 20;
            const isLastPageNoMore = total >= pageIncMonitor ? false : true;
            const regroup = result.count.map(el => (Object.assign(Object.assign({}, el), { percent: (el.count / total) * 100 })));
            return { total, lastPage: isLastPageNoMore, more: !isLastPageNoMore, summary: regroup, data: result.rows, };
        });
    }
    loadJobsBasedOnStatusFromStateOrTown(filter) {
        const sort = filter.sort ? filter.sort : 'desc';
        return exported_classes_1.DbModel.Job.findAndCountAll({
            where: {
                createdAt: { [Op.between]: [filter.start_range ? filter.start_range : 0, filter.end_range ? filter.end_range : Date.now()] },
            },
            include: {
                model: exported_classes_1.DbModel.Agent, as: 'worker',
                required: filter.state_or_town == 'all' ? false : true,
                include: {
                    model: exported_classes_1.DbModel.Location, as: 'location', required: true,
                    where: { [filter.state_or_town == 'all' ? 'state_id' : `${filter.state_or_town}_id`]: filter.state_or_town == 'all' ? { [Op.gt]: 0 } : filter.state_or_town_id }
                }
            },
            order: [['updatedAt', sort]],
            limit: filter.page ? 20 : null,
            offset: filter.page ? 20 * (filter.page - 1) : null,
            group: [filter.grouped_by]
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

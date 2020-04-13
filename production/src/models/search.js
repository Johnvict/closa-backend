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
class SearchModel {
    constructor() { }
    // jobRelations = [this.getUserWorkerRelation('user'), this.getUserWorkerRelation('worker')]
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
    create(next, newSearchHistory) {
        return __awaiter(this, void 0, void 0, function* () {
            const [history, created] = yield exported_classes_1.DbModel.SearchHistory.findOrCreate({
                where: {
                    [Op.and]: [
                        { agent_id: newSearchHistory.agent_id },
                        { key: newSearchHistory.key }
                    ]
                },
                defaults: newSearchHistory
            });
        });
    }
    getOne(next, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exported_classes_1.DbModel.Job.findByPk(id);
        });
    }
    searchesWithKeyWord(filter, my_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterArg = yield exported_classes_1.formatIntoRegExQueryArray(filter.key);
            return exported_classes_1.DbModel.SearchHistory.findAll({
                where: {
                    key: { [Op.or]: filterArg }
                },
                attributes: ['key'],
            }).then((result) => __awaiter(this, void 0, void 0, function* () {
                return result;
            }));
        });
    }
    workerWithjobsTitle(filter, my_id) {
        const filterArg = exported_classes_1.formatIntoRegExQueryArray(filter.job);
        return exported_classes_1.DbModel.Worker.findAll({
            where: {
                [Op.and]: [
                    { status: 'available' },
                    { job: { [Op.or]: filterArg } }
                ]
            },
            attributes: ['name', 'logo', 'job', 'agent_id'],
            include: [
                {
                    model: exported_classes_1.DbModel.Agent, as: 'agent', attributes: ['phone'], required: true, include: [
                        {
                            model: exported_classes_1.DbModel.Location, as: 'location', required: true,
                            where: { [Op.and]: [{ [`${filter.state_or_town}_id`]: filter.state_or_town_id }, { id: { [Op.ne]: my_id } }] },
                            attributes: ['name', 'image', 'long', 'lat'],
                            include: [
                                { model: exported_classes_1.DbModel.State, as: 'state', attributes: ['name'] },
                                { model: exported_classes_1.DbModel.Town, as: 'town', attributes: ['name'] }
                            ]
                        },
                        { model: exported_classes_1.DbModel.Job, as: 'worker_jobs', where: { status: 'done' }, attributes: ['rating'], }
                    ]
                },
            ],
        }).then(result => {
            return result;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return exported_classes_1.DbModel.SearchHistory.findAndCountAll({
                order: [['createdAt', 'desc']], limit: 20,
                attributes: ['key'],
                include: {
                    model: exported_classes_1.DbModel.Agent, as: 'agent',
                    attributes: ['username', 'email', 'phone', 'id', 'type', 'gender', 'dob']
                },
            })
                .then(result => {
                const isLastPageNoMore = result.count >= 20 ? false : true;
                return { total: result.count, lastPage: isLastPageNoMore, more: !isLastPageNoMore, data: result.rows };
            });
        });
    }
    getAllMore(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const sort = filter.sort ? filter.sort : 'desc';
            return exported_classes_1.DbModel.SearchHistory.findAndCountAll({
                order: [['createdAt', sort]], limit: 20,
                attributes: ['key'],
                offset: 20 * filter.page,
                include: {
                    model: exported_classes_1.DbModel.Agent, as: 'agent',
                    attributes: ['username', 'email', 'phone', 'id', 'type', 'gender', 'dob']
                },
            }).then(result => {
                const pageIncMonitor = (filter.page + 2) * 20;
                const isLastPageNoMore = result.count >= pageIncMonitor ? false : true;
                return { total: result.count, lastPage: isLastPageNoMore, more: !isLastPageNoMore, data: result.rows };
            });
        });
    }
    searchHistoryByKeyFromStateOrTownForAdmin(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.loadSearchHistoryFromStateOrTown(filter);
            const total = result.count.map(el => el.count).reduce((sum, num) => sum + num, 0);
            const pageIncMonitor = (filter.page + 1) * 20;
            const isLastPageNoMore = total >= pageIncMonitor ? false : true;
            const regroup = result.count.map(el => (Object.assign(Object.assign({}, el), { percent: (el.count / total) * 100 })));
            return { total, lastPage: isLastPageNoMore, more: !isLastPageNoMore, summary: regroup, data: result.rows, };
        });
    }
    searchHistoryByKeyFromStateOrTownForChart(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.loadSearchHistoryFromStateOrTown(filter);
            const total = result.count.map(el => el.count).reduce((sum, num) => sum + num, 0);
            const regroup = result.count.map(el => (Object.assign(Object.assign({}, el), { percent: (el.count / total) * 100 })));
            return { total, data: regroup };
        });
    }
    loadSearchHistoryFromStateOrTown(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterArg = yield exported_classes_1.formatIntoRegExQueryArray(filter.key);
            const sort = filter.sort ? filter.sort : 'desc';
            return exported_classes_1.DbModel.SearchHistory.findAndCountAll({
                where: {
                    [Op.and]: [
                        { createdAt: { [Op.between]: [filter.start_range ? filter.start_range : 0, filter.end_range ? filter.end_range : Date.now()] } },
                        { key: { [Op.or]: filterArg } }
                    ]
                },
                include: {
                    model: exported_classes_1.DbModel.Agent, as: 'agent',
                    required: filter.state_or_town == 'all' ? false : true,
                    attributes: ['username', 'email', 'phone', 'id', 'type', 'gender', 'dob'],
                    include: {
                        model: exported_classes_1.DbModel.Location, as: 'location',
                        required: true,
                        where: { [filter.state_or_town == 'all' ? 'state_id' : `${filter.state_or_town}_id`]: filter.state_or_town == 'all' ? { [Op.gt]: 0 } : filter.state_or_town_id }
                    }
                },
                attributes: ['key', 'createdAt'],
                order: [['createdAt', sort]],
                limit: filter.page ? 20 : null,
                offset: filter.page ? 20 * (filter.page - 1) : null,
                group: ['createdAt']
            });
        });
    }
}
exports.SearchModel = SearchModel;

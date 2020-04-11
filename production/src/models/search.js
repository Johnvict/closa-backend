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
            if (created)
                return yield this.getOne(next, history.id);
            return history;
        });
    }
    getOne(next, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exported_classes_1.DbModel.Job.findByPk(id);
        });
    }
    formatIntoQueryArray(arr) {
        return arr.map(str => {
            str = this.formatStringToFitRegExcape(str);
            const query = { [Op.regexp]: `.*${str}.*` };
            return query;
        });
    }
    sortByDistance() { }
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
    workerWithjobsTitle(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchKeys = yield this.convertTitle(filter.job);
            const filterArg = yield this.formatIntoQueryArray(searchKeys);
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
                                where: { [`${filter.state_or_town}_id`]: filter.state_or_town_id },
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
            }).then((result) => __awaiter(this, void 0, void 0, function* () {
                return result;
            }));
        });
    }
}
exports.SearchModel = SearchModel;

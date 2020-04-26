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
const Op = require('sequelize').Op;
class AgentModel {
    constructor() {
        this.duplicateExist = false;
        this.agentRelations = [
            { model: exported_classes_1.DbModel.User, as: 'profile', },
            {
                model: exported_classes_1.DbModel.Worker, as: 'business', include: [
                    {
                        model: exported_classes_1.DbModel.JobSample, as: 'job_samples', include: [
                            { model: exported_classes_1.DbModel.File, as: 'file' }
                        ]
                    }
                ]
            },
            { model: exported_classes_1.DbModel.Job, as: 'worker_jobs', limit: 10, order: [['updatedAt', 'DESC']], include: [this.getUserWorkerRelation('user'), this.getUserWorkerRelation('worker')] },
            { model: exported_classes_1.DbModel.Job, as: 'user_jobs', limit: 10, order: [['updatedAt', 'DESC']], include: [this.getUserWorkerRelation('user'), this.getUserWorkerRelation('worker')] },
            { model: exported_classes_1.DbModel.SearchHistory, as: 'search_histories', attributes: ['key'], order: [['updatedAt', 'DESC']] },
            {
                model: exported_classes_1.DbModel.Location, as: 'location', include: [
                    { model: exported_classes_1.DbModel.State, as: 'state', attributes: ['name', 'id'] },
                    { model: exported_classes_1.DbModel.Town, as: 'town', attributes: ['name', 'id', 'state_id'] }
                ]
            },
        ];
    }
    getUserWorkerRelation(who) {
        return {
            model: exported_classes_1.DbModel.Agent, as: who,
            include: [
                { model: who == 'user' ? exported_classes_1.DbModel.User : exported_classes_1.DbModel.Worker, as: who == 'user' ? 'profile' : 'business' },
                {
                    model: exported_classes_1.DbModel.Location, as: 'location', include: [
                        { model: exported_classes_1.DbModel.State, as: 'state' },
                        { model: exported_classes_1.DbModel.Town, as: 'town' }
                    ]
                }
            ]
        };
    }
    createAgent(next, newAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            return exported_classes_1.DbModel.Agent.findOrCreate({
                where: { [Op.or]: [{ phone: newAgent.phone }] },
                defaults: newAgent
            }).then((queryRes) => __awaiter(this, void 0, void 0, function* () {
                const token = yield this.generateToken(queryRes[0].id);
                exported_classes_1.tokenModel.create(next, token);
                console.log('QUERY-RESPONSE-0', queryRes[0]);
                console.log('QUERY-RESPONSE-1', queryRes[1]);
                return yield { data: queryRes[0] };
                // return await { token: token, data: ...this.getOne(next, queryRes[0].id) }
            })).catch(e => console.log(e));
        });
    }
    generateToken(agent_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const nums = [1, 9, 3, 8, 0, 5, 4, 7, 2, 6];
            const genToken = () => {
                let token = "";
                for (let i = 1; i <= 6; i++) {
                    token += nums[Math.floor(Math.random() * 9)];
                }
                return token;
            };
            return {
                agent_id,
                expireAt: new Date(Date.now() + 900000),
                token: genToken()
            };
        });
    }
    getOne(next, id, fromAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield exported_classes_1.DbModel.Agent.findByPk(id, { include: this.agentRelations });
                return data ? data : next(fromAdmin ? new exported_classes_1.AppError('no account found with this credential', 400, -1) : new exported_classes_1.AppError('no account found with this credential', 500));
            }
            catch (err) {
                return next(err.message);
            }
        });
    }
    getAll(next) {
        return __awaiter(this, void 0, void 0, function* () {
            return exported_classes_1.DbModel.Agent.findAndCountAll({ order: [['updatedAt', 'DESC']], limit: 20, include: this.agentRelations }).then(result => {
                const isLastPageNoMore = result.count >= 20 ? false : true;
                return { total: result.count, lastPage: isLastPageNoMore, more: !isLastPageNoMore, data: result.rows };
            });
        });
    }
    getAllMore(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const sort = filter.sort ? filter.sort : 'desc';
            return exported_classes_1.DbModel.Agent.findAndCountAll({
                order: [['updatedAt', sort]],
                limit: 1,
                offset: 1 * filter.page,
                include: this.agentRelations
            }).then(result => {
                const pageIncMonitor = (filter.page + 2) * 1;
                const isLastPageNoMore = result.count >= pageIncMonitor ? false : true;
                return { total: result.count, lastPage: isLastPageNoMore, more: !isLastPageNoMore, data: result.rows };
            });
        });
    }
    findOneWithFilter(next, filterArgs, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const agent = yield exported_classes_1.DbModel.Agent.findOne({ where: filterArgs });
            if (!agent)
                return next(new exported_classes_1.AppError(message, 400, -1));
            return yield this.getOne(next, agent.id);
        });
    }
    whatToUpdate(next, agent, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const newData = {};
            try {
                for (let key in agent) {
                    if (key == 'password')
                        agent[key] = exported_classes_1.auth.hashPassword(agent[key]);
                    newData[key] = agent[key];
                    if (key == 'email' || key == 'phone' || key == 'username') {
                        if (yield this.checkDuplicate(agent[key], key, id))
                            return this.reportDuplicate(next, key);
                    }
                }
            }
            catch (error) {
                console.table({ ERROR: error });
            }
            return newData;
        });
    }
    checkDuplicate(value, key, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const agent = yield exported_classes_1.DbModel.Agent.findOne({ where: { [Op.and]: [{ [key]: value }, { id: { [Op.ne]: id } }] } });
            return agent ? true : false;
        });
    }
    /**
     *
     * @param next
     * @param agent data to update
     * @param isToken in an event where token is provided, for a new agent account
     * @param id agent id
     */
    update(next, agent, isToken, id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.duplicateExist = false;
            const dataToStore = yield this.whatToUpdate(next, agent, id);
            if (this.duplicateExist)
                return;
            let data; // exist;
            const getAgentData = () => __awaiter(this, void 0, void 0, function* () {
                if (isToken) {
                    data = yield this.findOneWithFilter(next, { [Op.and]: [{ phone: agent.phone }, { id }] });
                    // exist = data.password ? true : false;
                    if (!data)
                        return next(new exported_classes_1.AppError('Invalid credentials submitted', 400, -1));
                }
                else {
                    data = yield this.getOne(next, id);
                }
                return data;
            });
            yield getAgentData();
            // if (exist) return next(new AppError('Account creation is already done', 400, -1))
            if (!isToken)
                delete dataToStore['type']; // ? The agent already created account completely, they can't change account type again
            return exported_classes_1.DbModel.Agent.update(dataToStore, { returning: true, where: id ? { id } : { phone: agent.phone } })
                .then((updatedUser) => __awaiter(this, void 0, void 0, function* () {
                yield getAgentData();
                if (isToken)
                    exported_classes_1.tokenModel.delete(id);
                return updatedUser ? data : next(new exported_classes_1.AppError('No account found with specified credentials', 400, -1));
            }))
                .catch(e => console.log(e));
        });
    }
    reportDuplicate(next, value) {
        this.duplicateExist = true;
        return next(new exported_classes_1.AppError(`this ${value} is taken`, 400, -1));
    }
}
exports.AgentModel = AgentModel;

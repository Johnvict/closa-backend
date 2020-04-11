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
            { model: exported_classes_1.DbModel.SearchHistory, as: 'search_histories' },
            {
                model: exported_classes_1.DbModel.Location, as: 'location', include: [
                    { model: exported_classes_1.DbModel.State, as: 'state' },
                    { model: exported_classes_1.DbModel.Town, as: 'town' }
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
                if (queryRes[1]) {
                    const token = yield this.generateToken(queryRes[0].id);
                    exported_classes_1.tokenModel.create(next, token);
                    return yield Object.assign(Object.assign({}, token), this.getOne(next, queryRes[0].id));
                }
                next(new exported_classes_1.AppError('account already exists', 400, -1));
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
    getOne(next, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield exported_classes_1.DbModel.Agent.findByPk(id, { include: this.agentRelations });
                return data ? data : next(new exported_classes_1.AppError('no account found with this credential', 500));
            }
            catch (err) {
                return next(err.message);
            }
        });
    }
    getAll(next) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield exported_classes_1.DbModel.Agent.findAll({ include: this.agentRelations });
            return users ? users : next(new exported_classes_1.AppError('no user found', 400, -1));
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
    whatToUpdate(next, agent, isToken, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const newData = {};
            try {
                for (let key in agent) {
                    if (key == 'password')
                        agent[key] = exported_classes_1.auth.hashPassword(agent[key]);
                    newData[key] = agent[key];
                    if (!isToken) {
                        if (key == 'email') {
                            if (yield this.checkDuplicate(next, agent.email, key, agent.phone))
                                return this.reportDuplicate(next, key);
                        }
                        if (key == 'phone') {
                            if (yield this.checkDuplicate(next, agent.phone, key, agent.phone, id))
                                return this.reportDuplicate(next, key);
                        }
                        if (key == 'username') {
                            if (yield this.checkDuplicate(next, agent.username.toLowerCase(), key, agent.phone))
                                return this.reportDuplicate(next, key);
                        }
                    }
                }
            }
            catch (error) {
                console.table({ ERROR: error });
            }
            return newData;
        });
    }
    // return DbModel.Worker.findOrUpdate({
    // 	where: {[Op.or]: [{phone}, {email}, {username}]},
    // 	defaults: { ...dataToStore }
    // })
    checkDuplicate(next, value, key, phone, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let exist = false;
            const agent = yield exported_classes_1.DbModel.Agent.findOne({ where: { [key]: value } });
            if (agent) {
                if (key === 'phone') {
                    if (agent.id !== id && agent.phone == value)
                        exist = true;
                }
                else {
                    if (agent.phone !== phone)
                        exist = true;
                }
            }
            return exist;
        });
    }
    update(next, agent, isToken, id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.duplicateExist = false;
            const dataToStore = yield this.whatToUpdate(next, agent, isToken, id);
            if (this.duplicateExist)
                return;
            let data, exist;
            const getAgentData = () => __awaiter(this, void 0, void 0, function* () {
                if (isToken) {
                    data = yield this.findOneWithFilter(next, { [Op.and]: [{ phone: agent.phone }, { id }] });
                    exist = data.password ? true : false;
                    if (!data)
                        return next(new exported_classes_1.AppError('Invalid credentials submitted', 400, -1));
                }
                else {
                    data = yield this.getOne(next, id);
                }
                return data;
            });
            yield getAgentData();
            if (exist)
                return next(new exported_classes_1.AppError('Account creation is already done', 400, -1));
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

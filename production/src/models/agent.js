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
        this.agentRelations = [
            { model: exported_classes_1.DbModel.User, as: 'profile' },
            {
                model: exported_classes_1.DbModel.Worker, as: 'business', include: [
                    {
                        model: exported_classes_1.DbModel.JobSample, as: 'job_samples', include: [
                            { model: exported_classes_1.DbModel.File, as: 'file' }
                        ]
                    }
                ]
            },
            { model: exported_classes_1.DbModel.Job, as: 'worker_jobs' },
            { model: exported_classes_1.DbModel.Job, as: 'user_jobs' },
            { model: exported_classes_1.DbModel.SearchHistory, as: 'search_histories' },
            {
                model: exported_classes_1.DbModel.Location, as: 'location', include: [
                    { model: exported_classes_1.DbModel.State, as: 'state' },
                    { model: exported_classes_1.DbModel.Town, as: 'town' }
                ]
            },
        ];
    }
    createAgent(newAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            return exported_classes_1.DbModel.Agent.findOrCreate({
                where: { [Op.or]: [{ phone: newAgent.phone }] },
                defaults: newAgent
            }).then((queryRes) => __awaiter(this, void 0, void 0, function* () {
                if (queryRes[1])
                    return { data: yield this.getOne(queryRes[0].id) };
                return { exist: true, data: yield this.findOneWithFilter({ phone: newAgent.phone }) };
            })).catch(e => console.log(e));
        });
    }
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield exported_classes_1.DbModel.Agent.findByPk(id, { include: this.agentRelations });
                console.log(data);
                return { data };
            }
            catch (err) {
                console.log(err.message);
                return { error: 'server error' };
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield exported_classes_1.DbModel.Agent.findAll({ include: this.agentRelations });
            return users ? { data: users } : { error: 'no user found' };
        });
    }
    findOneWithFilter(filterArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const agent = yield exported_classes_1.DbModel.Agent.findOne({ where: filterArgs });
            if (!agent)
                return { error: null };
            return { data: yield this.getOne(agent.id).then(data => data.data) };
        });
    }
    whatToUpdate(user) {
        const newData = {};
        for (let key in user) {
            if (key == '_id')
                continue;
            if (key == 'password')
                user[key] = exported_classes_1.auth.hashPassword(user[key]);
            newData[key] = user[key];
        }
        return newData;
    }
    update(agent, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataToStore = this.whatToUpdate(agent);
            let data;
            const getAgentData = (first = true) => __awaiter(this, void 0, void 0, function* () {
                if (id) {
                    data = yield this.getOne(id);
                }
                else {
                    data = yield this.findOneWithFilter({ phone: agent.phone }).then(data => data.data);
                    if (data.password)
                        return { error: 'Account creation is already done' };
                }
            });
            yield getAgentData();
            return exported_classes_1.DbModel.Agent.update(dataToStore, { returning: true, where: id ? { id } : { phone: agent.phone } })
                .then((updatedUser) => __awaiter(this, void 0, void 0, function* () {
                yield getAgentData(false);
                return updatedUser ? { data } : { error: 'No account found with specified credentials' };
            }))
                .catch(e => console.log(e));
        });
    }
}
exports.AgentModel = AgentModel;

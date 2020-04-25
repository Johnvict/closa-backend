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
class AgentController {
    // For a super admin who wants to see all registered user
    allAgents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const agents = yield exported_classes_1.agentModel.getAll(next);
            return res.status(200).json(Object.assign({ status: 1 }, agents));
        });
    }
    allAgentsMore(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const agents = yield exported_classes_1.agentModel.getAllMore(req.body);
            return res.status(200).json(Object.assign({ status: 1 }, agents));
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const newAgent = yield exported_classes_1.agentModel.createAgent(next, req.body);
            if (newAgent) {
                return res.status(201).json(Object.assign({ status: 1 }, newAgent));
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.agent.id; // ? Do not worry, newAgentMiddleware added the agent->id already
            const isToken = req.body.token;
            exported_classes_1.agentModel.update(next, Object.assign({}, req.body), isToken, id).then(response => {
                if (response)
                    return res.status(200).json({ status: 1, data: response });
            });
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(200).json({
                status: 1,
                data: yield exported_classes_1.agentModel.update(next, { active: false }, req.agent.id)
            });
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginData = req.body;
            const userData = yield exported_classes_1.agentModel.findOneWithFilter(next, { phone: loginData.phone }, 'invalid credentials');
            if (userData) {
                if (!userData.password)
                    return next(new exported_classes_1.AppError('please create your account completely', 400, -1));
                if (yield exported_classes_1.auth.comparePassword(next, { candidatePassword: loginData.password, hashedPassword: userData.password })) {
                    const otherid = userData.business ? userData.business.id : userData.profile ? userData.profile.id : 0;
                    res.status(200).json({
                        status: 1,
                        token: exported_classes_1.auth.generateToken(userData.id, userData.phone, userData.type, otherid),
                        data: userData
                    });
                    return this.upDateLoginTime(userData.id, userData.phone, next);
                }
            }
        });
    }
    upDateLoginTime(id, phone, next) {
        exported_classes_1.agentModel.update(next, { active: true, lastLoginAt: Date.now(), phone: phone }, null, id);
    }
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { old_password, new_password } = req.body;
            let agent = yield exported_classes_1.agentModel.findOneWithFilter(next, { id: req.agent.id }, 'invlid credentials');
            if (exported_classes_1.auth.comparePassword(next, { candidatePassword: old_password, hashedPassword: agent.password }, true)) {
                exported_classes_1.agentModel.update(next, { password: new_password }, agent.id).then(response => {
                    console.log(response);
                    if (response)
                        return res.status(200).json({ status: 1, data: response });
                });
            }
        });
    }
}
exports.AgentController = AgentController;

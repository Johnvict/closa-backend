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
    allAgents(req, res) {
        exported_classes_1.agentModel.getAll().then(response => {
            return response.error ? res.status(400).json({
                status: -1,
                message: response.error
            }) : res.status(200).json({
                status: 1,
                data: response.data
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            exported_classes_1.agentModel.createAgent(req.body).then(response => {
                return response.exist ?
                    res.status(200).json({ status: -1, data: response.data, exist: true }) :
                    res.status(201).json({ status: 1, data: response.data });
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.agent ? req.agent.id : null;
            exported_classes_1.agentModel.update(Object.assign({}, req.body), id).then(response => {
                return response.error ?
                    res.status(400).json({ status: -1, message: response.error }) :
                    res.status(200).json({ status: 1, data: response.data });
            });
        });
    }
    // We don't want to delete the user account, but change it to { active: false }
    delete(req, res) {
        exported_classes_1.agentModel.update({ active: false }, req.agent.id).then(response => {
            return response.error ?
                res.status(400).json({ status: -1, message: response.error }) :
                res.status(200).json({ status: 1, data: response.data });
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginData = req.body;
            exported_classes_1.agentModel.findOneWithFilter({ phone: loginData.phone }).then(response => {
                if (response.data) {
                    if (!exported_classes_1.auth.comparePassword({
                        candidatePassword: loginData.password,
                        hashedPassword: response.data.password
                    }))
                        return res.status(401).json({ status: '-1', message: 'invalid credentials' });
                    res.status(200).json({
                        status: 1,
                        token: exported_classes_1.auth.generateToken(response.data.id, response.data.phone, response.data.type),
                        data: response.data
                    });
                    return this.upDateLoginTime(response.data.id);
                }
                return res.status(401).json({ status: -1, message: 'invalid credentials' });
            });
        });
    }
    upDateLoginTime(id) {
        exported_classes_1.agentModel.update({ active: true, lastLoginAt: Date.now() }, id);
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { old_password, new_password } = req.body;
            let agent = yield exported_classes_1.agentModel.findOneWithFilter({ id: req.agent.id });
            if (agent.data) {
                const isOldPasswordValid = exported_classes_1.auth.comparePassword({ candidatePassword: old_password, hashedPassword: agent.data.password });
                if (!isOldPasswordValid)
                    return res.status(401).json({ status: -1, message: 'old password is invalid' });
                exported_classes_1.agentModel.update({ password: new_password }, agent.data.id).then(response => {
                    return response.error ? res.status(401).json({ status: -1, message: response.error }) : res.status(201).json({ status: 1, data: agent.data });
                });
            }
        });
    }
}
exports.AgentController = AgentController;

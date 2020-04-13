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
const exported_classes_1 = require("./../../app/exported.classes");
class AdminController {
    allAdmins(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isThisAdminAllowed(req, res, next, 'access')) {
                const admins = yield exported_classes_1.adminModel.getAll();
                return res.status(200).json({
                    status: 1,
                    data: admins
                });
            }
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isThisAdminAllowed(req, res, next, 'create')) {
                return res.status(201).json({
                    status: 1,
                    data: yield exported_classes_1.adminModel.create(next, req.body)
                });
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.id = req.admin.id;
            if (this.isThisAdminAllowed(req, res, next, 'update')) {
                exported_classes_1.adminModel.update(next, Object.assign({}, req.body)).then(response => {
                    if (response)
                        return res.status(200).json({ status: 1, data: response });
                });
            }
        });
    }
    updateSuper(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isThisAdminAllowed(req, res, next, 'update')) {
                exported_classes_1.adminModel.update(next, Object.assign({}, req.body)).then(response => {
                    if (response)
                        return res.status(200).json({ status: 1, data: response });
                });
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isThisAdminAllowed(req, res, next, 'delete')) {
                exported_classes_1.adminModel.update(next, req.body).then(data => {
                    if (data) {
                        return res.status(200).json({
                            status: 1,
                            data
                        });
                    }
                });
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginData = req.body;
            const adminData = yield exported_classes_1.adminModel.findOneWithFilter(next, { username: loginData.username });
            if (!adminData)
                return res.status(401).json({ status: -1, message: 'invalid credentials' });
            if (adminData) {
                if (yield exported_classes_1.auth.comparePassword(next, { candidatePassword: loginData.password, hashedPassword: adminData.password })) {
                    res.status(200).json({
                        status: 1,
                        token: exported_classes_1.auth.generateToken(adminData.id, adminData.phone, adminData.type, 10),
                        data: adminData
                    });
                    return this.upDateLoginTime(next, adminData.id);
                }
            }
        });
    }
    upDateLoginTime(next, id) {
        exported_classes_1.adminModel.update(next, { lastLoginAt: new Date(Date.now()), id });
    }
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isThisAdminAllowed(req, res, next, 'update')) {
                let { old_password, new_password } = req.body;
                let adminData = yield exported_classes_1.adminModel.findOneWithFilter(next, { id: req.admin.id });
                if (!adminData)
                    return res.status(401).json({ status: -1, message: 'invalid credentials' });
                if (exported_classes_1.auth.comparePassword(next, { candidatePassword: old_password, hashedPassword: adminData.password })) {
                    exported_classes_1.adminModel.update(next, { password: new_password, id: adminData.id }).then(response => {
                        console.log(response);
                        if (response)
                            return res.status(200).json({ status: 1, data: response });
                    });
                }
            }
        });
    }
    isThisAdminAllowed(req, res, next, action) {
        const thisLogedInId = req.admin.id;
        if (action == 'create' || action == 'access') {
            if (req.admin.type !== 'super') {
                return next(new exported_classes_1.AppError(`Access denied, you are not allowed to ${action} this account`, 401, -1));
            }
        }
        else {
            if (req.body.id !== thisLogedInId && req.admin.type !== 'super')
                return next(new exported_classes_1.AppError(`Access denied, you are not allowed to ${action} this account`, 401, -1));
        }
        return true;
    }
    createManyStates(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const states = req.body;
            states.forEach((state) => __awaiter(this, void 0, void 0, function* () {
                yield exported_classes_1.stateModel.create(next, state);
            }));
            return res.status(201).json({ status: 1, data: yield exported_classes_1.stateModel.getAll() });
        });
    }
    createManyTowns(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const towns = req.body;
            towns.forEach((town) => __awaiter(this, void 0, void 0, function* () {
                yield exported_classes_1.townModel.create(next, town);
            }));
            return res.status(201).json({ status: 1, data: yield exported_classes_1.townModel.getAll() });
        });
    }
    createState(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield exported_classes_1.stateModel.create(next, req.body.state);
            return state ?
                res.status(201).json({ status: 1, data: yield state }) :
                res.status(201).json({ status: -1, message: 'error creating state' });
        });
    }
    createTown(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const town = yield exported_classes_1.townModel.create(next, req.body.town);
            return town ?
                res.status(201).json({ status: 1, data: yield town }) :
                res.status(201).json({ status: -1, message: 'error creating town' });
        });
    }
    updateState(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            exported_classes_1.stateModel.update(next, req.body).then(data => {
                if (data) {
                    return res.status(200).json({ status: 1, data: data });
                }
            });
        });
    }
    updateTown(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            exported_classes_1.townModel.update(next, req.body).then(data => {
                if (data) {
                    return res.status(200).json({ status: 1, data });
                }
            });
        });
    }
    deleteState(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            exported_classes_1.stateModel.delete(next, req.body).then(data => {
                if (data) {
                    return res.status(200).json({ status: 1, data: data });
                }
            });
        });
    }
    deleteTown(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            exported_classes_1.townModel.delete(next, req.body).then(data => {
                if (data) {
                    return res.status(200).json({ status: 1, data: data });
                }
            });
        });
    }
}
exports.AdminController = AdminController;

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
// import { Sequelize } from '../../models';
// const sequelize = require("sequelize");
// const Op = require('sequelize').Op;
const sequelize_1 = require("sequelize");
class AdminModel {
    constructor() { }
    create(next, newAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            newAdmin.password = exported_classes_1.auth.hashPassword(newAdmin.password);
            for (let key in newAdmin) {
                if (key == 'username' || key == 'email' || key == 'phone') {
                    if (yield this.checkUniquenessExistence(newAdmin[key], key)) {
                        return next((new exported_classes_1.AppError(`this ${key} is already taken`, 400, -1)));
                    }
                }
            }
            const [admin, created] = yield exported_classes_1.DbModel.Admin.findOrCreate({
                where: { [sequelize_1.Op.or]: [{ username: newAdmin.username }, { phone: newAdmin.phone }, { email: newAdmin.email }] },
                defaults: newAdmin
            });
            if (created)
                return yield this.getOne(next, admin.id);
            return admin;
        });
    }
    getOne(next, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exported_classes_1.DbModel.Admin.findByPk(id);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exported_classes_1.DbModel.Admin.findAll();
        });
    }
    delete(next, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield exported_classes_1.DbModel.Admin.destroy({ where: { id } });
                console.log(data);
                return data < 1 ? next(new exported_classes_1.AppError('no admin data found with this credential', 400, -1)) : true;
            }
            catch (err) {
                return next(err.message);
            }
        });
    }
    findOneWithFilter(next, filterArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield exported_classes_1.DbModel.Admin.findOne({ where: filterArgs });
            return admin ? admin : next(new exported_classes_1.AppError('no admin data found with this credential', 400, -1));
        });
    }
    whatToUpdate(next, data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const newData = {};
            for (let key in data) {
                if (key == 'phone' || key == 'email' || key == 'username') {
                    if (yield this.checkUniquenessExistence(data[key], key, id)) {
                        next((new exported_classes_1.AppError(`this ${key} is already taken`, 400, -1)));
                        return false;
                    }
                }
                if (key == 'password')
                    data[key] = exported_classes_1.auth.hashPassword(data.password);
                newData[key] = data[key];
            }
            return newData;
        });
    }
    checkUniquenessExistence(value, key, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = id
                ? yield exported_classes_1.DbModel.Admin.findOne({ where: { [sequelize_1.Op.and]: [{ [key]: value }, { id: { [sequelize_1.Op.ne]: id } }] } })
                : yield exported_classes_1.DbModel.Admin.findOne({ where: { [key]: value } });
            return admin ? true : false;
        });
    }
    update(next, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.getOne(next, data.id);
            if (!admin)
                return next(new exported_classes_1.AppError('no admin data found with this credential', 400, -1));
            const dataToStore = yield this.whatToUpdate(next, data, data.id);
            if (typeof dataToStore == 'boolean')
                return null;
            return exported_classes_1.DbModel.Admin.update(dataToStore, { returning: true, where: { id: data.id } })
                .then((_) => __awaiter(this, void 0, void 0, function* () {
                return yield this.getOne(next, data.id);
            }))
                .catch(e => console.log(e));
        });
    }
}
exports.AdminModel = AdminModel;

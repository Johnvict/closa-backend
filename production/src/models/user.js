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
// const Op = require('sequelize').Op;
const sequelize_1 = require("sequelize");
class UserModel {
    constructor() { }
    create(next, newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            return exported_classes_1.DbModel.User.findOrCreate({
                where: { [sequelize_1.Op.or]: [{ agent_id: newUser.agent_id }] },
                defaults: newUser
            }).then((queryRes) => __awaiter(this, void 0, void 0, function* () {
                if (queryRes[1])
                    return yield this.getOne(next, queryRes[0].id);
                return next(new exported_classes_1.AppError('user profile already created', 400, -1));
            })).catch(e => console.log(e));
        });
    }
    getOne(next, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exported_classes_1.DbModel.User.findByPk(id);
        });
    }
    findOneWithFilter(next, filterArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield exported_classes_1.DbModel.User.findOne({ where: filterArgs });
            return user ? user : next(new exported_classes_1.AppError('no user account found with this credential', 400, -1));
        });
    }
    whatToUpdate(user) {
        const newData = {};
        for (let key in user) {
            newData[key] = user[key];
        }
        return newData;
    }
    update(next, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataToStore = this.whatToUpdate(user);
            return exported_classes_1.DbModel.User.update(dataToStore, { returning: true, where: { agent_id: user.agent_id } })
                .then((_) => __awaiter(this, void 0, void 0, function* () {
                return yield this.findOneWithFilter(next, { agent_id: user.agent_id });
            }))
                .catch(e => console.log(e));
        });
    }
}
exports.UserModel = UserModel;

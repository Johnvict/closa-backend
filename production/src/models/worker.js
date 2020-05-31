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
class WorkerModel {
    constructor() { }
    create(newWorker) {
        return __awaiter(this, void 0, void 0, function* () {
            return exported_classes_1.DbModel.Worker.findOrCreate({
                where: { [sequelize_1.Op.or]: [{ agent_id: newWorker.agent_id }] },
                defaults: newWorker
            }).then((queryRes) => __awaiter(this, void 0, void 0, function* () {
                if (queryRes[1])
                    return { data: yield this.getOne(queryRes[0].id) };
                return { exist: true, data: yield this.findOneWithFilter({ agent_id: newWorker.agent_id }) };
            })).catch(e => console.log(e));
        });
    }
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exported_classes_1.DbModel.Worker.findByPk(id);
        });
    }
    findOneWithFilter(filterArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exported_classes_1.DbModel.Worker.findOne({ where: filterArgs });
        });
    }
    whatToUpdate(user) {
        const newData = {};
        for (let key in user) {
            newData[key] = user[key];
        }
        return newData;
    }
    update(worker) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataToStore = this.whatToUpdate(worker);
            return exported_classes_1.DbModel.Worker.update(dataToStore, { returning: true, where: { agent_id: worker.agent_id } })
                .then((_) => __awaiter(this, void 0, void 0, function* () {
                return yield this.findOneWithFilter({ agent_id: worker.agent_id });
            }))
                .catch(e => console.log(e));
        });
    }
}
exports.WorkerModel = WorkerModel;

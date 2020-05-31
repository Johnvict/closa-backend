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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exported_classes_1 = require("./../app/exported.classes");
// const sequelize = require("sequelize");
// const Op = require('sequelize').Op;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("sequelize"));
class StateModel {
    constructor() {
        this.stateRelations = { model: exported_classes_1.DbModel.Town, as: 'towns' };
    }
    create(next, newState) {
        return __awaiter(this, void 0, void 0, function* () {
            const [state, created] = yield exported_classes_1.DbModel.State.findOrCreate({
                where: { [sequelize_1.Op.or]: [{ name: newState.name }] },
                defaults: newState
            });
            if (created)
                return yield this.getOne(next, state.id);
            return state;
        });
    }
    ifStateExists(next, newState) {
        return __awaiter(this, void 0, void 0, function* () {
            const withCaseInsensitive = sequelize_2.default.where(sequelize_2.default.fn('LOWER', sequelize_2.default.col('name')), 'LIKE', `%${newState.name}%`);
            const { count, rows } = yield exported_classes_1.DbModel.State.findAndCountAll({
                where: {
                    [sequelize_1.Op.and]: [
                        { name: withCaseInsensitive },
                    ]
                },
                offset: 10,
                limit: 1
            });
            if (count > 0)
                return yield exported_classes_1.DbModel.State.findOne({ where: { name: withCaseInsensitive } });
            return null;
        });
    }
    getOne(next, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exported_classes_1.DbModel.State.findByPk(id);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exported_classes_1.DbModel.State.findAll({ include: this.stateRelations });
        });
    }
    delete(next, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                exported_classes_1.DbModel.State.destroy({ where: { id } }).then(data => {
                    return data < 1 ? next(new exported_classes_1.AppError('data not found', 400, -1)) : true;
                });
            }
            catch (err) {
                return next(err.message);
            }
        });
    }
    findOneWithFilter(next, filterArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield exported_classes_1.DbModel.State.findOne({ where: filterArgs });
            return state ? state : next(new exported_classes_1.AppError('no state data found with this credential', 400, -1));
        });
    }
    whatToUpdate(data) {
        const newData = {};
        for (let key in data) {
            newData[key] = data[key];
        }
        return newData;
    }
    update(next, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataToStore = this.whatToUpdate(data);
            const state = this.getOne(next, data.id);
            if (!state)
                return next(new exported_classes_1.AppError('no state data found with this credential', 400, -1));
            return exported_classes_1.DbModel.State.update(dataToStore, { returning: true, where: { id: data.id } })
                .then((_) => __awaiter(this, void 0, void 0, function* () {
                return yield this.getOne(next, data.id);
            }))
                .catch(e => console.log(e));
        });
    }
}
exports.StateModel = StateModel;

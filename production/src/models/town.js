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
const sequelize = require("sequelize");
const Op = require('sequelize').Op;
class TownModel {
    constructor() {
        this.townRelations = { model: exported_classes_1.DbModel.State, as: 'state' };
    }
    create(next, newTown) {
        return __awaiter(this, void 0, void 0, function* () {
            // const existed: Town = await this.ifTownExists(next, newTown);
            // if (!existed) {
            const [town, created] = yield exported_classes_1.DbModel.Town.findOrCreate({
                where: { [Op.or]: [{ name: newTown.name }] },
                defaults: newTown
            });
            if (created)
                return yield this.getOne(next, town.id);
            return town;
            // }
            // return existed;
        });
    }
    ifTownExists(next, newTown) {
        return __awaiter(this, void 0, void 0, function* () {
            const withCaseInsensitive = sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', `%${newTown.name}%`);
            const { count, rows } = yield exported_classes_1.DbModel.Town.findAndCountAll({
                where: {
                    [Op.and]: [
                        { name: withCaseInsensitive },
                        // { name: { [Op.like]: `%${newTown.name}%` } },
                        { state_id: newTown.state_id },
                    ]
                },
                offset: 10,
                limit: 1
            });
            if (count > 0)
                return yield exported_classes_1.DbModel.Town.findOne({ where: { name: withCaseInsensitive } });
            return null;
        });
    }
    getOne(next, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exported_classes_1.DbModel.Town.findByPk(id);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exported_classes_1.DbModel.Town.findAll({ include: this.townRelations });
        });
    }
    delete(next, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                exported_classes_1.DbModel.Town.destroy({ where: { id } }).then(data => {
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
            const town = yield exported_classes_1.DbModel.Town.findOne({ where: filterArgs });
            return town ? town : next(new exported_classes_1.AppError('no town data found with this credential', 400, -1));
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
            return exported_classes_1.DbModel.Town.update(dataToStore, { returning: true, where: { id: data.id } })
                .then((_) => __awaiter(this, void 0, void 0, function* () {
                return yield this.getOne(next, data.id);
            }))
                .catch(e => console.log(e));
        });
    }
}
exports.TownModel = TownModel;

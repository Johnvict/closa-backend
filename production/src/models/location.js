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
class LocationModel {
    constructor() { }
    create(next, newLocation) {
        return __awaiter(this, void 0, void 0, function* () {
            // We sahll first confirm if the town exists already
            // if (!newLocation.town_id) {
            // 	const newTown: Town = await townModel.create(next, {name: newLocation.town_name, state_id: newLocation.state_id});
            // 	newLocation.town_id = newTown.id;
            // }
            // const dataToStore = { 
            // 	agent_id: newLocation.agent_id,
            // 	lat: newLocation.lat,
            // 	long: newLocation.long,
            // 	name: newLocation.name,
            // 	image: newLocation.image,
            // 	state_id: newLocation.state_id,
            // 	town_id: newLocation.town_id
            //   }
            return exported_classes_1.DbModel.Location.findOrCreate({
                where: { [Op.or]: [{ agent_id: newLocation.agent_id }] },
                defaults: newLocation
            }).then((queryRes) => __awaiter(this, void 0, void 0, function* () {
                if (queryRes[1])
                    return yield this.getOne(next, queryRes[0].id);
                return next(new exported_classes_1.AppError('user location already created', 400, -1));
            })).catch(e => console.log(e));
        });
    }
    getOne(next, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exported_classes_1.DbModel.Location.findByPk(id);
        });
    }
    findOneWithFilter(next, filterArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = yield exported_classes_1.DbModel.Location.findOne({ where: filterArgs });
            // console.log('40: LOCATION FOUND', location)
            return location ? location : next(new exported_classes_1.AppError('no location data found with this credential', 400, -1));
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
            return exported_classes_1.DbModel.Location.update(dataToStore, { returning: true, where: { agent_id: data.agent_id } })
                .then((_) => __awaiter(this, void 0, void 0, function* () {
                return yield this.findOneWithFilter(next, { agent_id: data.agent_id });
            }))
                .catch(e => console.log(e));
        });
    }
}
exports.LocationModel = LocationModel;

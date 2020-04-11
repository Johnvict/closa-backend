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
class LocationController {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield exported_classes_1.locationModel.create(next, Object.assign(Object.assign({}, req.body), { agent_id: req.agent.id }));
            if (data)
                return res.status(201).json({ status: 1, data });
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('48: REQUEST IMAGE', req.body)
            const data = yield exported_classes_1.locationModel.update(next, Object.assign(Object.assign({}, req.body), { agent_id: req.agent.id }));
            if (data)
                return res.status(200).json({ status: 1, data });
        });
    }
}
exports.LocationController = LocationController;

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
            return res.status(200).json({ status: 1, data: yield exported_classes_1.stateModel.update(next, req.body) });
        });
    }
    updateTown(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(200).json({ status: 1, data: yield exported_classes_1.townModel.update(next, req.body) });
        });
    }
    deleteState(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(200).json({ status: 1, data: yield exported_classes_1.stateModel.delete(next, req.body) });
        });
    }
    deleteTown(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(200).json({ status: 1, data: yield exported_classes_1.townModel.delete(next, req.body) });
        });
    }
}
exports.AdminController = AdminController;

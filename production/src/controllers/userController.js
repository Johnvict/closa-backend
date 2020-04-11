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
class UserController {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.agent.type != 'user')
                return next(new exported_classes_1.AppError('This is not a user account', 400, -1));
            const data = yield exported_classes_1.userModel.create(next, Object.assign(Object.assign({}, req.body), { agent_id: req.agent.id }));
            if (data) {
                return res.status(201).json({ status: 1, data });
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.agent.type != 'user')
                return next(new exported_classes_1.AppError('This is not a user account', 400, -1));
            return res.status(200).json({ status: 1, data: yield exported_classes_1.userModel.update(next, Object.assign(Object.assign({}, req.body), { agent_id: req.agent.id })) });
        });
    }
}
exports.UserController = UserController;
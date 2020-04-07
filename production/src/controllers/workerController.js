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
class WorkerController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.agent.type != 'worker')
                return res.status(400).json({ status: -1, message: 'This is not a worker account' });
            exported_classes_1.workerModel.create(Object.assign(Object.assign({}, req.body), { agent_id: req.agent.id })).then(response => {
                return response.exist ?
                    res.status(200).json({ status: -1, data: response.data, exist: true }) :
                    res.status(201).json({ status: 1, data: response.data });
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.agent.type != 'worker')
                return res.status(400).json({ status: -1, message: 'This is not a worker account' });
            exported_classes_1.workerModel.update(Object.assign(Object.assign({}, req.body), { agent_id: req.agent.id })).then(response => {
                return response ?
                    res.status(200).json({ status: 1, data: response }) :
                    res.status(400).json({ status: -1, message: 'error updating business profile' });
            });
        });
    }
}
exports.WorkerController = WorkerController;

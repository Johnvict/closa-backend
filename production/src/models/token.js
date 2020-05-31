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
class TokenModel {
    constructor() { }
    create(next, newToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return exported_classes_1.DbModel.Token.findOrCreate({
                where: { [sequelize_1.Op.or]: [{ agent_id: newToken.agent_id }] },
                defaults: newToken
            }).then((queryRes) => __awaiter(this, void 0, void 0, function* () {
                if (!queryRes[1]) {
                    this.update(newToken);
                }
                // ! ! ! Send the token to the phone number as text message
                // ! ! ! Send the token to the phone number as text message
                // ! ! ! Send the token to the phone number as text message
            })).catch(e => console.log(e));
        });
    }
    validateToken(receivedToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield exported_classes_1.DbModel.Token.findOne({ where: { agent_id: receivedToken.agent_id } });
            if (token) {
                console.table(Object.assign(Object.assign({}, token), { trueOrFalse: ((token.token == receivedToken.token) && (new Date(token.expireAt).getTime() >= Date.now())) }));
                return (token.token == receivedToken.token) && (new Date(token.expireAt).getTime() >= Date.now()) ? true : false;
            }
            return false;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                exported_classes_1.DbModel.Token.destroy({ where: { agent_id: id } });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    update(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return exported_classes_1.DbModel.Token.update(token, { where: { agent_id: token.agent_id } })
                .then((_) => __awaiter(this, void 0, void 0, function* () { }))
                .catch(e => console.log(e));
        });
    }
}
exports.TokenModel = TokenModel;

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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var exported_classes_1 = require("./../app/exported.classes");
var Op = require('sequelize').Op;
var UserModel = (function () {
    function UserModel() {
        this.userRelations = [
            { model: exported_classes_1.DbModel.User, as: 'profile' },
            { model: exported_classes_1.DbModel.Worker, as: 'business' },
            {
                model: exported_classes_1.DbModel.Location, as: 'location', include: [
                    { model: exported_classes_1.DbModel.State, as: 'state' },
                    { model: exported_classes_1.DbModel.Town, as: 'town' }
                ]
            },
        ];
    }
    UserModel.prototype.create = function (newUser) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                newUser.password = exported_classes_1.auth.hashPassword(newUser.password);
                return [2, exported_classes_1.DbModel.Agent.findOrCreate({
                        where: (_a = {}, _a[Op.or] = [{ phone: newUser.phone }], _a),
                        defaults: newUser
                    }).then(function (queryRes) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!queryRes[1]) return [3, 2];
                                    _a = {};
                                    return [4, this.getOne(queryRes[0].id)];
                                case 1: return [2, (_a.data = _b.sent(), _a)];
                                case 2: return [2, { error: "data already exists" }];
                            }
                        });
                    }); }).catch(function (e) { return console.log(e); })];
            });
        });
    };
    UserModel.prototype.getOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = {};
                        return [4, exported_classes_1.DbModel.Agent.findByPk(id, { include: this.userRelations })];
                    case 1: return [2, (_a.data = _b.sent(), _a)];
                    case 2:
                        err_1 = _b.sent();
                        console.log(err_1.message);
                        return [2, { error: 'server error' }];
                    case 3: return [2];
                }
            });
        });
    };
    UserModel.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, exported_classes_1.DbModel.Agent.findAll()];
                    case 1:
                        users = _a.sent();
                        return [2, users ? { data: users } : { error: 'no user found' }];
                }
            });
        });
    };
    UserModel.prototype.findOneWithFilter = function (filterArgs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, exported_classes_1.DbModel.Agent.findOne({ where: filterArgs })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    UserModel.prototype.whatToUpdate = function (user) {
        var newData = {};
        for (var key in user) {
            if (key == '_id')
                continue;
            if (key == 'password')
                user[key] = exported_classes_1.auth.hashPassword(user[key]);
            newData[key] = user[key];
        }
        return newData;
    };
    UserModel.prototype.update = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var dataToStore;
            var _this = this;
            return __generator(this, function (_a) {
                dataToStore = this.whatToUpdate(user);
                return [2, exported_classes_1.DbModel.Agent.update(dataToStore, { returning: true, where: { id: dataToStore.id } })
                        .then(function (updatedUser) { return __awaiter(_this, void 0, void 0, function () {
                        var userData;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, this.getOne(user.id)];
                                case 1:
                                    userData = _a.sent();
                                    return [2, updatedUser ? { data: userData } : { error: 'No account found with this id' }];
                            }
                        });
                    }); })
                        .catch(function (e) { return console.log(e); })];
            });
        });
    };
    return UserModel;
}());
exports.UserModel = UserModel;

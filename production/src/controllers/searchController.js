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
class SearchController {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield exported_classes_1.searchModel.create(next, Object.assign(Object.assign({}, req.body), { agent_id: req.agent.id }));
            console.log(data);
            if (data)
                return res.status(201).json({ status: 1, data });
        });
    }
    search(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield exported_classes_1.searchModel.workerWithjobsTitle(req.body);
            if (data)
                return res.status(201).json({ status: 1, data });
        });
    }
    searchToArrange(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                method: 'POST',
                url: 'search/available-worker',
                body: req.body,
                token: req.header('authorization'),
            };
            const response = yield exported_classes_1.apiCaller(request);
            if (response.error)
                return res.json(response.error);
            console.log(response.data);
            console.log(response.error);
            return res.status(200).send(yield this.sortComputeRating(response.data.data, req.body.my_lat, req.body.my_long));
        });
    }
    sortComputeRating(data, my_lat, my_long) {
        const newObjArray = [];
        data.forEach(dataObj => {
            const newObj = dataObj;
            for (let key in dataObj.agent) {
                if (key === "location") {
                    newObj['location'] = Object.assign(Object.assign({}, dataObj.agent.location), { state: dataObj.agent.location.state.name, town: dataObj.agent.location.town.name, distance: exported_classes_1.distanceCalculator(dataObj.agent.location.lat, dataObj.agent.location.long, my_lat, my_long, 'K') });
                }
                else if (key === "worker_jobs") {
                    const total_rating_points = dataObj.agent.worker_jobs.reduce((sum, val) => ((val.rating * 5) + sum), 0);
                    const total_rating_available = dataObj.agent.worker_jobs.length;
                    const total_obtainable_rating = total_rating_available * 5;
                    const average_raiting_obtained = total_rating_points / total_obtainable_rating;
                    newObj['rating'] = { total: total_rating_available, average: average_raiting_obtained };
                }
                else {
                    newObj[key] = dataObj.agent[key];
                }
            }
            delete newObj['agent'];
            newObjArray.push(newObj);
        });
        return this.sortByDistance(newObjArray);
    }
    sortByDistance(arr) {
        return arr.sort((a, b) => a.location.distance > b.location.distance ? 1 : -1);
    }
}
exports.SearchController = SearchController;

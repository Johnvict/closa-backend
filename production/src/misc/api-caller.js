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
const url = 'http://localhost:3030/api';
const fetch = require('node-fetch');
function makeAPICall(requestOption) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = yield {
            method: requestOption.method,
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            }
        };
        if (requestOption.token)
            options.headers['Authorization'] = requestOption.token;
        if (requestOption.body)
            options['body'] = JSON.stringify(requestOption.body);
        return yield fetch(`${url}/${requestOption.url}`, options)
            .then(resp => resp.json())
            .then(res => {
            console.log(res);
            return res.status === -1 ? { error: res } : { data: res };
        }, err => {
            console.log('ERROR FETCHING REQUEST: ', err);
            return err;
        });
    });
}
exports.makeAPICall = makeAPICall;

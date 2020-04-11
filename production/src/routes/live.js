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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Router = express_1.default.Router();
const { io } = require('./../app/connection');
const fetch = require('node-fetch');
const url = 'http://localhost:3030/api';
Router.use('/', (req, res, next) => {
});
io.on('connection', (socket) => {
    const sendError = (errorMessage) => {
        socket.emit('error-occured', errorMessage);
    };
    socket.on('disconnect', function () {
        if (socket.user)
            socket.broadcast.to.emit('users-changed', { user: socket.user.username, event: 'left' });
    });
    socket.on('join-chat', (conversationData) => {
        const isAlreadyInRoom = (rooms, roomName) => {
            const ind = rooms.findIndex((room) => room.name === roomName);
            return ind === -1 ? false : true;
        };
        if (!isAlreadyInRoom(socket.rooms, conversationData.name)) {
            const reqOpts = {
                url: `chat/one/${conversationData._id}`,
                method: 'GET'
            };
            makeAPICall(reqOpts).then((response) => {
                if (!response.data)
                    return sendError(response.error);
                socket.join(response.data.name);
                socket.rooms.push({ _id: response.data._id, name: response.data.name });
                socket.broadcast.to(response.data.name).emit(response.data);
            });
        }
    });
    socket.on('set-name', (loginData) => __awaiter(void 0, void 0, void 0, function* () {
        if (!loginData.email)
            return sendError('Invalid data provided');
        const reqOpts = {
            url: 'user/login',
            body: loginData,
            method: 'POST'
        };
        makeAPICall(reqOpts).then(response => {
            if (response.error)
                return sendError(response.error.message);
            socket.user = response.data.data;
            socket.token = response.data.token;
            socket.rooms = [];
            socket.broadcast.to.emit('users-changed', { user: socket.user.username, event: 'joined' });
        });
    }));
    socket.on('send-message', (message) => {
        const reqOpts = {
            url: message.messagesInThisConversation ? 'chat/message' : 'chat',
            body: message.messagesInThisConversation ? message.message : message.newConversation,
            method: 'POST'
        };
        makeAPICall(reqOpts).then((response) => {
            if (response.error)
                return sendError(response.error);
            socket.broadcast.to(response.data ? .name : ).emit('message', { msg: response.data ? .conversation :  });
        });
    });
});
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
            return res.status === -1 ? { error: res } : { data: res };
        }, err => {
            console.log('ERROR FETCHING REQUEST: ', err);
            return err;
        });
    });
}
/**
 * ! HOW TO YOU UPDATE MESSAGE
 * ! HOW ARE REQUESTS SENT FROM THE FRONTENT
 * ! HOW DOES THE FRONTEND KNOWS THAT A PARTICULAR MESSAGE IS FOR A PARTICULAR ROOM ? I think that is resolved 		already
 * ! THE FRONTEND SHOULD LOGIN TO SOCKET ON ENTERING USERS PAGE,,, JOIN SOCKET ONCE ENTERED A USER PAGE
 */
module.exports = Router;

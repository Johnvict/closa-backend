import { UserLogin, RequestOption, GroupChatEntry, GroupChatStruct, SocketRoom, NewGroupChatMessage, NewGroupChat } from './../misc/structs';
import express, { response } from 'express'
const Router = express.Router()
const { io } = require('./../app/connection')
const fetch = require('node-fetch');
const url = 'http://localhost:3030/api'


io.on('connection', (socket) => {

	const sendError = (errorMessage) => {
		socket.emit('error-occured', errorMessage)
	}

	socket.on('disconnect', function () {
		if (socket.user) socket.broadcast.to.emit('users-changed', { user: socket.user.username, event: 'left' });
	});

	socket.on('join-chat', (conversationData: GroupChatEntry) => {
		const isAlreadyInRoom = (rooms: SocketRoom[], roomName: string) => {
			const ind = rooms.findIndex((room: SocketRoom) => room.name === roomName)
			return ind === -1 ? false : true
		}

		if (!isAlreadyInRoom(socket.rooms, (conversationData.name as string))) {
			const reqOpts: RequestOption = {
				url: `chat/one/${conversationData._id}`,
				method: 'GET'
			}
			makeAPICall(reqOpts).then((response: { error?: any, data?: GroupChatStruct }) => {
				if (!response.data) return sendError(response.error)
				socket.join(response.data.name)
				socket.rooms.push({ _id: response.data._id, name: response.data.name })
				socket.broadcast.to(response.data.name).emit(response.data)
			})
		}
	})

	socket.on('set-name', async (loginData: UserLogin) => {
		if (!loginData.email) return sendError('Invalid data provided')
		const reqOpts: RequestOption = {
			url: 'user/login',
			body: loginData,
			method: 'POST'
		}
		makeAPICall(reqOpts).then(response => {
			if (response.error) return sendError(response.error.message)
			socket.user = response.data.data
			socket.token = response.data.token
			socket.rooms = [];
			socket.broadcast.to.emit('users-changed', { user: socket.user.username, event: 'joined' });
		})
	});

	socket.on('send-message', (message: { messagesInThisConversation: boolean, message?: NewGroupChatMessage, newConversation?: NewGroupChat }) => {

		const reqOpts: RequestOption = {
			url: message.messagesInThisConversation ? 'chat/message' : 'chat',
			body: message.messagesInThisConversation ? message.message : message.newConversation,
			method: 'POST'
		}
		makeAPICall(reqOpts).then((response: { error?: any, data?: GroupChatStruct }) => {
			if (response.error) return sendError(response.error)
			socket.broadcast.to(response.data?.name).emit('message', { msg: response.data?.conversation });
		})
	});

});

async function makeAPICall(requestOption: RequestOption): Promise<{ error?: any, data?: any }> {

	const options = await {
		method: requestOption.method,
		headers: {
			'Accept': 'application/json',
			'Content-type': 'application/json'
		}
	}
	if (requestOption.token) options.headers['Authorization'] = requestOption.token
	if (requestOption.body) options['body'] = JSON.stringify(requestOption.body)

	return await fetch(`${url}/${requestOption.url}`, options)
		.then(resp => resp.json())
		.then(res => {
			return res.status === -1 ? { error: res } : { data: res }
		}, err => {
			console.log('ERROR FETCHING REQUEST: ', err)
			return err
		})

}

/**
 * ! HOW DO YOU UPDATE MESSAGE 
 * ! HOW ARE REQUESTS SENT FROM THE FRONTEND
 * ! HOW DOES THE FRONTEND KNOWS THAT A PARTICULAR MESSAGE IS FOR A PARTICULAR ROOM ? I think that is resolved already
 * ! THE FRONTEND SHOULD LOGIN TO SOCKET ON ENTERING USERS PAGE,,, JOIN SOCKET ONCE ENTERED A USER PAGE
 */
module.exports = Router;
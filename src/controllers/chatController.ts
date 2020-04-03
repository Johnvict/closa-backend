import { GroupChatStruct, NewGroupChat, UpdateMessageStruct, NewGroupChatMessage, DeleteMessageStruct } from './../misc/structs';
import { groupChatModel } from './../app/exported.classes'

export class ChatController {
	allConversations(req, res) {	
		groupChatModel.getAllConversations(req.user._id).then( response => {
			return response.error ? res.status(200).json({
				status: -1,
				message: response.error
			}) : res.status(200).json({
				status: 1,
				data: response.data
			})
		})
	}

	async getOneConversation(req, res) {
		groupChatModel.getConversation(req.params._id).then( response => {
			return response.error ? 
			res.status(404).json({ status: -1, message: response.error}) :
			res.status(200).json({ status: 1, message: response.data})
		})
	}

	async checkIfExist(conversation: GroupChatStruct | NewGroupChat) {
		return await groupChatModel.findOneWithFilter({
			type: conversation.type,
			name: { $eq: conversation.name }
		})
	}

	async createConversation(req, res) {
		const conversation: NewGroupChat = req.body
		const isConversationExist = await this.checkIfExist(conversation)
		const createNew = async () => {
			const conver = await groupChatModel.createConversation(conversation)
			return conver.error ? res.status(400).json({
				status: -1,
				...conver.error
			})
			 : res.status(201).json({
				status: 1,
				data: conver.data
			})
		}
		
		if (isConversationExist) {
			const conver = await groupChatModel.newMessage(conversation.message, (conversation._id as string))
			return conver.error ? createNew() : res.status(201).json({ status: 1, data: conver.data })
		}
		return createNew()

	}

	async createNewMessage(req, res) {
		const conversation: NewGroupChatMessage = req.body
		const conver = await groupChatModel.newMessage(conversation.message, (conversation.conversation_id as string))
		return conver.error ? res.status(400).json({
			status: -1,
			message: conver.error
		}) : res.status(201).json({
			status: 1,
			data: conver.data
		})
	}

	async updateMessage (req, res) {
		const data: UpdateMessageStruct = req.body
		groupChatModel.updateMessage(data).then( response => {
			return response.error ? res.status(400).json({
				status: -1,
				message: response.error
			}) : res.status(200).json({
				status: 1,
				data: response.data
			});
		})
	}

	deleteMessage (req, res) {
		const data: DeleteMessageStruct = req.body
		groupChatModel.deleteMessage(data).then( response => {
			return response.error ? 
				res.status(400).json({ status: -1, message: response.error }) : 
				res.status(200).json({ status: 1, data: response.data });
		})
	}

}

import { ChatMessage, NewGroupChat, GroupChatStruct, UpdateMessageStruct, DeleteMessageStruct } from './../misc/structs';
import { formatError } from './../app/exported.classes'
// import { chatModel } from './../app/exported.classes'

// import { Mongoose } from 'mongoose'
const { mongoose } =  require('./../app/connection')

export class GroupChatModel {
	chatSchema = new mongoose.Schema({
		message: { type: String, required: true, 
			validate: { validator: function(v) {
					return v && v !== ''
				}, message: 'Please send a valid message'
			}
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: true,
			validate: { validator: function(v) {
					return v && v !== ''
				}, message: 'Please send valid sender id'
			}
		},
		status: { type: String, enum: ['sent', 'delivered', 'read'], lowercase: true, trim: true, default: 'sent' },
		type: { type: String, enum: ['text', 'file', 'link'], lowercase: true, trim: true, required: true }
	}, {timestamps: true})

	chatModel = mongoose.model('message', this.chatSchema);

	GroupChatObj = mongoose.model('conversation', new mongoose.Schema({
		name: {
			type: String,
			required: true
		},
		members: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: true,
			validate: { validator: function(v) {
					return v && v !== ''
				}, message: 'Please send valid sender id'
			}
		}],
		type: { type: String, enum: ['duel', 'poly'], lowercase: true, trim: true, required: true },
		conversation: [this.chatSchema]		// an array or chatSchema model..  a Group has a conversation which is an array of chats (messages)
	}, {timestamps: true}))

	constructor() { }

	// createNewMember() 
	async createNewMessage(newMessage: ChatMessage) {
		const message = await new this.chatModel({
			message: newMessage.message,
			sender: newMessage.sender,
			type: newMessage.type
		})

		return message;
	}

	async createConversation(newGroupChat: NewGroupChat): Promise<{error?: object, data?: GroupChatStruct}> {
		const groupChat: any | GroupChatStruct = new this.GroupChatObj({
			name: newGroupChat.name,
			type: newGroupChat.type,
			members: newGroupChat.members.map( member => member),
			conversation: await this.createNewMessage(newGroupChat.message)
		})
		try {
			await groupChat.save()
			return { data: groupChat }
		} catch(e) {
			return { error: formatError(e) }
		}
	}

	async newMessage(message: ChatMessage, conversation_id: string): Promise<{error?: string, data?: GroupChatStruct}> {
		const groupMessage: any | GroupChatStruct = await this.GroupChatObj.findOne({ _id: conversation_id })
		if (!groupMessage) return { error: 'conversation not found' }
		const newMessage = await this.createNewMessage(message)
		await groupMessage.conversation.push(newMessage)

		await groupMessage.save()
		return { data:  groupMessage }
	}
	async getConversation(_id): Promise<{error?: string, data?: GroupChatStruct}> {
		const groupMessage: any | GroupChatStruct = await this.GroupChatObj.findOne({ _id })
		// console.log(_id, groupMessage)
		if (!groupMessage) return { error: 'conversation not found' }
		return { data: groupMessage }
	}

	async getAllConversations(user_id): Promise<{error?: string, data?: GroupChatStruct[]}> {
		const groupMessage: any | GroupChatStruct = await this.GroupChatObj
		.find({ members:  user_id })
		.populate('members', '-password -__v -lastLoginAt -updatedAt -createdAt -active');
		// console.log(groupMessage)
		if (!groupMessage) return { error: 'conversation not found' }
		return { data: groupMessage }
	}

	async getAll(id) {
		return await this.GroupChatObj.findById(id)
		.populate('members', '-password, username');
	}

	async findOneWithFilter(filter): Promise<null | GroupChatStruct> {
		const conversation: any | GroupChatStruct = this.GroupChatObj.findOne(filter)
		if (!conversation) return null
		return conversation
	}
	async updateMessage(data: UpdateMessageStruct): Promise<{ error?: string, data?: ChatMessage}> {
		const groupMessage: any = await this.findOneWithFilter({ _id: data.conversation_id});
		if (!groupMessage) return { error: 'conversation not found'}

		const ind = groupMessage.conversation.findIndex(mssg => mssg._id === data.message._id)
		if (ind == -1) return { error: 'message not found'}

		groupMessage.conversation[ind].status = data.message.status
		await groupMessage.save()
		return { data: groupMessage.conversation[ind] }
	}

	async deleteMessage(ids: DeleteMessageStruct): Promise<{ error?: string, data?: ChatMessage}> {
		const groupMessage: any = await this.findOneWithFilter({_id: ids.conversation_id});
		if (!groupMessage) return { error: 'conversation not found'}

		const message = groupMessage.conversation.id(ids.message_id)		
		if (!message) return { error: 'message not found'}

		message.remove();
		await groupMessage.save();
		return { data: message }
	}

	
	// this.ChatObj.find(filterArgs)
	// 	.limit(10)
	// 	.sort({sender: 1})
	// 	.select({message: 1, })

	// ! Comparison Operator in Mongoose
	/** 
	 * ? eq	-	Equal
	 * ? ne	-	Not equal
	 * ? gt	-	Greater than
	 * ? gte -	Greater than or Equal to
	 * ? lt -	Less than
	 * ? lte -	Less than or Equal to
	 * ? in
	 * ? nin -	Not in
	 */

	//  ! Logical Operators 
	/**
	 * ? or
	 * ? and
	 */

	//  ! Regular Expression
	/** 
	 * ? Starts With 'John':	/^John/
	 * ? End with 'Mary':		/Mary$/
	 * ? To make it case-insensitive, append an "i":  End with 'Mary':		/Mary$/i
	 */ 
	// ? Contains the word 'Love' (Zero or more characters): /.*Love.*/

	// this.ChatObj
	// .find( {read: { $eq: true }, sender: { $in: ['John', 'Mary', 'James'] }})
	// .or([ { read: true }, { delivered: true } ])
	// .limit(10)
	// .sort({sender: 1})
	// .select({message: 1, })
	// .count()		// ? Returns the count of docs that match the filter

	// ! PAGINATION
	// const pageNumber = 2
	// const pageSize = 10
	// this.ChatObj
	// .find( {read: { $eq: true }, sender: { $in: ['John', 'Mary', 'James'] }})
	// .skip((pageNumber - 1) * pageSize)  //? Skip items in the previous page
	// .limit(pageSize)
}
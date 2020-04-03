import { ChatMessage, GenericObject } from "../misc/structs"
const { mongoose } = require('./../app/connection')

export class ChatModel {
	ChatObj = mongoose.model('chat', new mongoose.Schema({
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
	}, {timestamps: true}))
	 

	constructor() { }

	async create(message: ChatMessage): Promise<{error?: string, data?: ChatMessage | any }> {
		const chat = new this.ChatObj({
			message: message.message,
			sender: message.sender,
			type: message.type
		}) 
		try {
			await chat.save()
			return { data: chat }
		} catch(e) {
			return { error: `error saving message: ${e.message}`} 
		}
	}

	async getOne(id: string) {
		return await this.ChatObj.findById(id)
		.populate('sender', '-password, username');
	}

	async getAll() {
		return await this.ChatObj.find()
		.populate('sender', '-password, username');
	}

	async delete(id: string) {
		return await this.ChatObj.findByIdAndDelete(id)
	}

	async update(message: ChatMessage) {
		const updatedMessage = await this.ChatObj.findByIdAndUpdate(message._id, message);
		// this.getWithFilter({sender: 'john', createdAt: new Date})
	}

	async getWithFilter(filterArgs: GenericObject) {
		return await this.ChatObj.find(filterArgs)
		.populate('sender', '-password, username');
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
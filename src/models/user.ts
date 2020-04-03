import { GenericObject, UserStruct, UpdateUserAccount } from "../misc/structs"
import { Authorization } from './../middleware/authorization'
const auth = new Authorization
import { PROTECTED_FIELDS } from './../misc/app.variables'

const { mongoose } = require('./../app/connection')
// import { Mongoose } from 'mongoose'
// const mongoose = new Mongoose()


export class UserModel {
	UserObj = mongoose.model('user', new mongoose.Schema({
		email: { type: String, required: true, unique: true },
		username: { type: String, required: [true, 'username is required'],
			validate: {
				validator: function (v) {
					if (v) v.trim()
					return !v || (v && v == '') ? false : true			// ? If true, then no ERROR else ERROR 
				}, message: props => `${props.value}: Please send a valid username!`
			}
		},
		location: { type: Object, default: null },
		address: { type: String, required: true },
		phone: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		type: { type: String, enum: ['user', 'tailor'], lowercase: true, trim: true, required: true },
		active: { type: Boolean, default: true },
		lastLoginAt: { type: Date, default: Date.now },
	}, {timestamps: true}))

	constructor() { }

	async create(user: UserStruct): Promise<{error?: GenericObject, data?: UserStruct}> {
		const newUser: any | UserStruct = new this.UserObj({
			username: user.username,
			email: user.email,
			address: user.address,
			location: user.location,
			phone: user.phone,
			type: user.type,
			password: auth.hashPassword(user.password),
		})
		try {
			await newUser.save()
			return { data : newUser }
		} catch( errors) {
			return { error: errors.message }
		}
	}

	async removeObject(user: UserStruct) {
		let attributes = Object.assign({}, user)
		for (let a of PROTECTED_FIELDS) {
			delete attributes[a]
		}
		return attributes
	}
	async getOne(id: string) {
		return await this.UserObj.findById(id);
	}

	async getAll(): Promise<{error?: string, data?: UserStruct[]}> {
		const users = await this.UserObj
		.find()
		.select({ _id: 1, location: 1, username: 1, email: 1, address: 1, phone: 1 })
		return users ? { data: users } : { error: 'no user found'}
	}

	// async delete(id: string): Promise<{error?: string, data?: UserStruct}> {
	// 	const data: any | UserStruct = await this.UserObj.findByIdAndRemove(id)
	// 		return data ? { data } : { error: 'No user found with this id'}
	// }

	whatToUpdate(user): GenericObject {
		const newData = {}
		for (let key in user) {
			if (key == '_id') continue
			newData[key] = user[key]
		}
		return newData
	}

	async update(user: UpdateUserAccount): Promise<{error?: string, data?: UserStruct}> {
		// if(!mongoose.Types.ObjectId.isValid(user._id)) return {error: 'invalid user id'};
		const data: any | UserStruct = await this.UserObj
		.findOneAndUpdate({ _id: user._id}, this.whatToUpdate(user), { new: true });
		return data ?  { data } : { error: 'No user found with this id'}
	}

	async findOneWithFilter(filterArgs: GenericObject) {
		const oneUser = await this.UserObj
		.findOne(filterArgs)
		return oneUser
	}

	async getWithFilter(filterArgs: GenericObject) {
		const user = await this.UserObj
			.find(filterArgs)
			// .select({ password: 0 })
		return user
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


	//! ASYNC VALIDATION
	// SampleSchema = new mongoose.Schema({
	// 	name: { type: String, required: true,
	// 		validate: {
	// 			isAsync: true,
	// 			validator: function(v, callback) {
	// 				// let's simulate a 3 seconds delay
	// 				setTimeout( () => {
	// 					const match = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	// 					const result = match.test(String(v).toLowerCase())
	// 					callback(result)
	// 				}, 3000)
	// 			}, message: 'Please send a valid email'
	// 		}
	// 	}
	// });
}
import { PasswordAuthValidation } from "../misc/structs";
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
import { auth } from './../app/exported.classes'


export class Validator {
	newUserStruct = Joi.object({
		email: Joi.string().email().min(5).max(255).required(),
		password: Joi.string().min(5).max(200).required(),
		username: Joi.string().min(3).max(20).required(),
		phone: Joi.string().min(11).max(11).required(),
		address: Joi.string().min(3).max(20).required(),
		location: Joi.object({latitude: Joi.string(), longitude: Joi.string()}),
		type: Joi.string().required()
	});
	
	newConversation = Joi.object({
		name: Joi.string().min(5).max(255).required(),
		members: Joi.array().min(2).required(),
		message: Joi.object({
			sender: Joi.objectId().required(),
			message: Joi.string().required(),
			type: Joi.string().required(),
		}).required(),
		type: Joi.string().required(),
	});

	newMessageStruct = Joi.object({
		message: Joi.object({
			sender: Joi.objectId().required(),
			message: Joi.string().required(),
			type: Joi.string().required(),
		}).required(),
		conversation_id: Joi.objectId().required()
	});
	
	updateUserStruct = Joi.object({
		email: Joi.string().email().min(5).max(255).required(),
		location: Joi.object({ latitude: Joi.string(), longitude: Joi.string() }),
		phone: Joi.string().min(11).max(11).required(),
		type: Joi.string().required()
	})
	
	updatePasswordStruct = Joi.object({
		old_password: Joi.string().min(5).max(255).required(),
		new_password: Joi.string().min(5).max(255).required()
	})

	loginData = Joi.object({ 
		password: Joi.string().required(),
		email: Joi.string().email().required()
	})

	email = Joi.object({ 
		email: Joi.string().email().required()
	})

	phone = Joi.object({ 
		phone: Joi.string().required()
	})
	
	id = Joi.object({ 
		id: Joi.objectId().required()
	})
	
	validateEmail(email): boolean {
		const match = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return match.test(String(email).toLowerCase())
	}

	validatePassword(data: PasswordAuthValidation): boolean {
		return auth.comparePassword(data);
	}

	validate(schema) {
		return (req, res, next) => {
			const { error } = schema.validate(req.body)
			if (error) return res.status(400).send(error.details[0].message)
			next()
		}
	}

	formatError(er?) {
		// er = "conversation validation failed: type: Path `type` is required."
		// let key = er.substr(er.indexOf('Path \`') + 6)
		// 	// ! "type` is required."
		// let  keyy = key.substr(0, key.indexOf('`'))
		// 	// ! "type"
		// let error = key.substr(key.indexOf('`') + 2)
		// 	// ! "is required."
		// let message = er.substr(0, er.indexOf(':'))
		// return { message, errors: {[keyy]: [`${keyy} ${error}`]} }
		
		
		let errorObj = new Object({});
		for (let key in er.errors) {
			const text = er.errors[key]['message'];
			errorObj[key] = [`${key} ${text.substr(text.indexOf(`\`${key}\``) + `${key}`.length + 3)}`]
		}

		return { message: er.name, errors: errorObj }


		// ! Error example
		// multiError = {
		// 	"errors": {
		// 		"type": {
		// 			"message": "Path `type` is required.",
		// 			"name": "ValidatorError",
		// 			"properties": {
		// 				"message": "Path `type` is required.",
		// 				"type": "required",
		// 				"path": "type"
		// 			},
		// 			"kind": "required",
		// 			"path": "type"
		// 		},
		// 		"name": {
		// 			"message": "Path `name` is required.",
		// 			"name": "ValidatorError",
		// 			"properties": {
		// 				"message": "Path `name` is required.",
		// 				"type": "required",
		// 				"path": "name"
		// 			},
		// 			"kind": "required",
		// 			"path": "name"
		// 		}
		// 	},
		// 	"_message": "conversation validation failed",
		// 	"message": "conversation validation failed: type: Path `type` is required., name: Path `name` is required.",
		// 	"name": "ValidationError"
		// }
	}
	// validator([...keys], data: any) {
	// 	let error: any[] = [];
	// 	keys.forEach(key => {
	// 		if (!data[key]) error.push(key);
	// 	});
	// 	return error.length < 1 ? true : {status: -1, error: "some fields are missing", fields: error};
	// }
}



import { PasswordAuthValidation } from "../misc/structs";
const Joi = require('@hapi/joi');
import { auth } from './../app/exported.classes'


export class Validator {
	newUserStruct = Joi.object({
		password: Joi.string().min(5).max(200).required(),
		phone: Joi.string().min(11).max(11).required(),
		// username: Joi.string().min(3).max(20).required(),
		// email: Joi.string().email().min(5).max(255).required(),
		// address: Joi.string().min(3).max(20).required(),
		// location: Joi.object({latitude: Joi.string(), longitude: Joi.string()}),
		type: Joi.string().required()
	});
	
	
	updateUserStruct = Joi.object({
		phone: Joi.string().min(11).max(11).required(),
		type: Joi.string().required()
		// email: Joi.string().email().min(5).max(255).required(),
		// location: Joi.object({ latitude: Joi.string(), longitude: Joi.string() }),
	})
	
	updatePasswordStruct = Joi.object({
		old_password: Joi.string().min(5).max(255).required(),
		new_password: Joi.string().min(5).max(255).required()
	})

	loginData = Joi.object({ 
		password: Joi.string().required(),
		phone: Joi.string().required()
	})

	email = Joi.object({ 
		email: Joi.string().email().required()
	})

	phone = Joi.object({ 
		phone: Joi.string().required()
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
		let errorObj = new Object({});
		for (let key in er.errors) {
			const text = er.errors[key]['message'];
			errorObj[key] = [`${key} ${text.substr(text.indexOf(`\`${key}\``) + `${key}`.length + 3)}`]
		}
		return { message: er.name, errors: errorObj }
	}
}



import { PasswordAuthValidation } from "../misc/structs";
const Joi = require('@hapi/joi');
import { auth } from './../app/exported.classes'
import { Joi } from '@hapi/joi';
import { maxHeaderSize } from "http";


export class Validator {
	newAgent = Joi.object({
		password: Joi.string().min(5).max(200).required(),
		phone: Joi.string().min(11).max(15).required(),
		type: Joi.alternatives(['user', 'worker']).required()
	});
	updateAgent = Joi.object({
		phone: Joi.string().min(11).max(15),
		type: Joi.alternatives(['user', 'worker'])
	});
	
	newJobSample = Joi.object({
		date_done: Joi.date().required(),
		title: Joi.string().required(),
		file: Joi.object({
			data: Joi.string().required(),
			type: Joi.alternatives(['audio', 'video', 'image', 'pdf', 'link']).required()
		})
	});

	newLocation = Joi.object({
		lat: Joi.string().required(),
		long: Joi.string().required(),
		name: Joi.string().max(100).required(),
		image: Joi.string().required(),
		state_id: Joi.number().required(),
		town_id: Joi.string().required(),
	});
	updateLocation = Joi.object({
		lat: Joi.string(),
		long: Joi.string(),
		name: Joi.string().max(100),
		image: Joi.string(),
		state_id: Joi.number(),
		town_id: Joi.string(),
	});

	newJob = Joi.object({
		worker_id: Joi.number().required(),
		user_id: Joi.string().required(),
		title: Joi.string().max(100).required(),
	});

	newSearchHistory = Joi.object({
		key: Joi.string().max(30).required(),
	});

	newState = Joi.object({
		name: Joi.string().max(30).required(),
	});
	updateState = Joi.object({
		name: Joi.string().max(30),
	});

	newTown = Joi.object({
		state_id: Joi.number().required(),
		name: Joi.string().max(30).required(),
	});
	updateTown = Joi.object({
		state_id: Joi.number(),
		name: Joi.string().max(30),
	});

	updateJob = Joi.object({
		status: Joi.alternatives(['canceled', 'pending', 'doing', 'done_pending', 'done']),
		start: Joi.date(),
		est_delivery: Joi.date(),
		delivery: Joi.date(),
		rating: Joi.alternatives(['1', '2', '3', '4', '5']),
		amount: Joi.number(),
		proposed_amount: Joi.number(),
		canceled_by: Joi.alternatives(['worker', 'user']),
		canceled_reason: Joi.alternatives(['price', 'trust', 'imcapability', 'self']),
	});

	newWorker = Joi.object({
		job: Joi.string().max(80).required(),
		business_name: Joi.string().max(50).required(),
		opening_time: Joi.string().max(6).required(),
		closing_time: Joi.string().max(6).required(),
		working_days: Joi.string().max(15).required(),
		business_logo: Joi.string(),
	});

	updateWorker = Joi.object({
		job: Joi.string().max(80),
		opening_time: Joi.string().max(6),
		closing_time: Joi.string().max(6),
		working_days: Joi.string().max(15),
		business_logo: Joi.string(),
	});

	newUser = Joi.object({
		name: Joi.string().max(30).required(),
		occupations: Joi.string().max(50),
	});
	updateUser = Joi.object({
		name: Joi.string().max(30),
		occupations: Joi.string().max(50),
	});

	updatePasswordStruct = Joi.object({
		old_password: Joi.string().min(5).max(50).required(),
		new_password: Joi.string().min(5).max(50).required()
	})

	loginData = Joi.object({
		password: Joi.string().max(50).required(),
		phone: Joi.string().max(50).required()
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



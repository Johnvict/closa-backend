const Joi = require('@hapi/joi');
import { Joi } from '@hapi/joi';


export class Validator {
	newAccount = Joi.object({
		phone: Joi.string().max(15).required(),
	})
	newAgent = Joi.object({
		agent_id: Joi.number().required(),
		password: Joi.string().min(5).max(200).required(),
		phone: Joi.string().min(11).max(15).required(),
		token: Joi.string().min(6).max(6).required(),
		type: Joi.alternatives(['user', 'worker']).required()
	});
	updateAgent = Joi.object({
		phone: Joi.string().min(11).max(15),
		username: Joi.string().min(3).max(25),
		email: Joi.string().email().max(25),
		dob: Joi.date(),
		gender: Joi.alternatives(['male', 'female']),
		type: Joi.alternatives(['user', 'worker'])
	});
	newAdmin = Joi.object({
		password: Joi.string().min(5).max(200).required(),
		phone: Joi.string().min(11).max(15).required(),
		username: Joi.string().min(3).max(25).required(),
		email: Joi.string().email().max(25).required(),
		dob: Joi.date().required(),
		gender: Joi.alternatives(['male', 'female']).required(),
		type: Joi.alternatives(['admin', 'super']).required()
	});

	updateAdminSuper = Joi.object({
		id: Joi.number().required(),
		password: Joi.string().min(5).max(200),
		phone: Joi.string().min(11).max(15),
		username: Joi.string().min(3).max(25),
		email: Joi.string().email().max(25),
		dob: Joi.date(),
		gender: Joi.alternatives(['male', 'female']),
		type: Joi.alternatives(['admin', 'super'])
	});
	updateAdmin = Joi.object({
		password: Joi.string().min(5).max(200),
		phone: Joi.string().min(11).max(15),
		username: Joi.string().min(3).max(25),
		email: Joi.string().email().max(25),
		dob: Joi.date(),
		gender: Joi.alternatives(['male', 'female']),
		type: Joi.alternatives(['admin', 'super'])
	});


	// if type is link, link will be provided, else null
	// if type is not link, link will be saved as null then updated on file upload
	newJobSample = Joi.object({
		date_done: Joi.date().required(),
		title: Joi.string().required(),
		link: Joi.string(),
		type: Joi.alternatives(['audio', 'video', 'image', 'pdf', 'link']).required()
	});

	jobSampleFile = Joi.object({
		file: Joi.string(),
	})

	newLocation = Joi.object({
		lat: Joi.string().required(),
		long: Joi.string().required(),
		name: Joi.string().max(100).required(),
		image: Joi.string(),
		state_id: Joi.number().required(),
		town_id: Joi.number()
	});
	updateLocation = Joi.object({
		lat: Joi.string(),
		long: Joi.string(),
		name: Joi.string().max(100),
		image: Joi.string(),
		state_id: Joi.number(),
		town_id: Joi.number()
	});

	newJob = Joi.object({
		worker_id: Joi.number().required(),
		user_id: Joi.number().required(),
		title: Joi.string().max(100).required(),
	});
	loadMoreJobs = Joi.object({
		worker_id: Joi.number().required(),
		user_id: Joi.number().required(),
		page: Joi.number().required(0),
	});

	// ? CHART AND ADMIN ENDPOINTS
	jobsByStatusFrom = Joi.object({
		state_or_town: Joi.alternatives(['state', 'town', 'all']).required(),
		state_or_town_id: Joi.number().required(),
		start_range: Joi.date(),
		end_range: Joi.date(),
		grouped_by: Joi.alternatives(['status', 'createdAt']),
		sort: Joi.alternatives(['asc', 'desc']),
		page: Joi.number().min(0)
	});

	jobWithTitleByStatusFrom = Joi.object({
		state_or_town: Joi.alternatives(['state', 'town', 'all']).required(),
		state_or_town_id: Joi.number().required(),
		title: Joi.string().required(),
		grouped_by: Joi.alternatives(['status', 'createdAt']),
		start_range: Joi.date(),
		end_range: Joi.date(),
		sort: Joi.alternatives(['asc', 'desc']),
		page: Joi.number().min(0)
	});
	
	searchHistoryByKey = Joi.object({
		key: Joi.string().required(),
		state_or_town: Joi.alternatives(['state', 'town', 'all']).required(),
		state_or_town_id: Joi.number().required(),
		start_range: Joi.date(),
		end_range: Joi.date(),
		sort: Joi.alternatives(['asc', 'desc']),
		page: Joi.number().min(0)
	});

	// ? USERS WHO SEARCH FOR WORKERS BASED ON SKILLS
	availableWorkerWithjobsTitle = Joi.object({
		state_or_town: Joi.alternatives(['state', 'town']).required(),
		state_or_town_id: Joi.number().required(),
		job: Joi.string().required(),
		my_lat: Joi.string().required(),
		my_long: Joi.string().required()
	});


	states = Joi.object().keys({
		name: Joi.string().max(30).required()
	})
	newManyStates = Joi.array().items(this.states)

	towns = Joi.object().keys({
		state_id: Joi.number().required(),
		name: Joi.string().max(30).required(),
		lat: Joi.string().required(),
		long: Joi.string().required()
	})
	newManyTowns = Joi.array().items(this.towns);

	newState = Joi.object({
		name: Joi.string().max(30).required(),
	});
	updateState = Joi.object({
		id: Joi.number().min(1).required(),
		name: Joi.string().max(30),
	});
	deleteWithId = Joi.object({
		id: Joi.number().min(1).required(),
	});

	newTown = Joi.object({
		state_id: Joi.number().required(),
		name: Joi.string().max(30).required(),
		lat: Joi.string().required(),
		long: Joi.string().required()
	});
	updateTown = Joi.object({
		id: Joi.number().min(1).required(),
		state_id: Joi.number(),
		name: Joi.string().max(30),
		lat: Joi.string(),
		long: Joi.string()
	});

	updateJob = Joi.object({
		id: Joi.number(),
		status: Joi.alternatives(['cancelled', 'pending', 'doing', 'done_pending', 'done']),
		start: Joi.date(),
		est_delivery: Joi.date(),
		delivery: Joi.date(),
		rating: Joi.alternatives(['1', '2', '3', '4', '5']),
		amount: Joi.number(),
		proposed_amount: Joi.number(),
		cancelled_by: Joi.alternatives(['worker', 'user']),
		cancelled_reason: Joi.alternatives(['price', 'trust', 'imcapability', 'self']),
	});

	newWorker = Joi.object({
		job: Joi.string().required(),
		name: Joi.string().min(3).max(50).required(),
		opening_time: Joi.string().min(5).max(6).required(),
		closing_time: Joi.string().min(5).max(6).required(),
		working_days: Joi.string().min(1).max(15).required(),
		logo: Joi.string(),
	});

	updateWorker = Joi.object({
		job: Joi.string().max(80),
		opening_time: Joi.string().max(6),
		closing_time: Joi.string().max(6),
		working_days: Joi.string().max(15),
		logo: Joi.string(),
	});

	newUser = Joi.object({
		name: Joi.string().max(30).required(),
		occupation: Joi.string().max(50),
		avatar: Joi.string()
	});
	updateUser = Joi.object({
		name: Joi.string().max(30),
		occupation: Joi.string().max(50),
		avatar: Joi.string()
	});

	updatePasswordStruct = Joi.object({
		old_password: Joi.string().min(5).max(50).required(),
		new_password: Joi.string().min(5).max(50).required()
	})

	loginData = Joi.object({
		password: Joi.string().max(50).required(),
		phone: Joi.string().max(15).required(),
		// source: Joi.alternatives(['app', 'web']).required()
	})
	adminloginData = Joi.object({
		password: Joi.string().max(50).required(),
		username: Joi.string().max(15).required(),
	})


	// ? LOAD MORE - ADMIN WANTS TO SEE ALL JOBS/AGENTS SO FAR
	allLoadMore = Joi.object({
		page: Joi.number().required(0),
		sort: Joi.alternatives(['asc', 'desc']),
	})


	validateEmail(email): boolean {
		const match = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return match.test(String(email).toLowerCase())
	}

	validate(schema) {
		return (req, res, next) => {
			const { error } = schema.validate(req.body)
			if (error) return res.status(400).json({ message: error.details[0].message, status: -1 })
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



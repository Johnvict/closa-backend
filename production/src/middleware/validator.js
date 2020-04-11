"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require('@hapi/joi');
class Validator {
    constructor() {
        this.newAccount = Joi.object({
            phone: Joi.string().max(15).required(),
        });
        this.newAgent = Joi.object({
            agent_id: Joi.number().required(),
            password: Joi.string().min(5).max(200).required(),
            phone: Joi.string().min(11).max(15).required(),
            token: Joi.string().min(6).max(6).required(),
            type: Joi.alternatives(['user', 'worker']).required()
        });
        this.updateAgent = Joi.object({
            phone: Joi.string().min(11).max(15),
            username: Joi.string().min(3).max(25),
            email: Joi.string().email().max(25),
            dob: Joi.date(),
            gender: Joi.alternatives(['male', 'female']),
            type: Joi.alternatives(['user', 'worker'])
        });
        // if type is link, link will be provided, else null
        // if type is not link, link will be saved as null then updated on file upload
        this.newJobSample = Joi.object({
            date_done: Joi.date().required(),
            title: Joi.string().required(),
            link: Joi.string(),
            type: Joi.alternatives(['audio', 'video', 'image', 'pdf', 'link']).required()
        });
        this.jobSampleFile = Joi.object({
            file: Joi.string(),
        });
        this.newLocation = Joi.object({
            lat: Joi.string().required(),
            long: Joi.string().required(),
            name: Joi.string().max(100).required(),
            image: Joi.string(),
            state_id: Joi.number().required(),
            town_id: Joi.number()
        });
        this.updateLocation = Joi.object({
            lat: Joi.string(),
            long: Joi.string(),
            name: Joi.string().max(100),
            image: Joi.string(),
            state_id: Joi.number(),
            town_id: Joi.number()
        });
        this.newJob = Joi.object({
            worker_id: Joi.number().required(),
            user_id: Joi.number().required(),
            title: Joi.string().max(100).required(),
        });
        this.loadMoreJobs = Joi.object({
            worker_id: Joi.number().required(),
            user_id: Joi.number().required(),
            page: Joi.number().required(),
        });
        this.jobsByStatusFrom = Joi.object({
            state_or_town: Joi.alternatives(['state', 'town']).required(),
            state_or_town_id: Joi.number().required(),
            start_range: Joi.date(),
            end_range: Joi.date()
        });
        this.jobWithTitleByStatusFrom = Joi.object({
            state_or_town: Joi.alternatives(['state', 'town']).required(),
            state_or_town_id: Joi.number().required(),
            title: Joi.string().required(),
            start_range: Joi.date(),
            end_range: Joi.date()
        });
        this.availableWorkerWithjobsTitle = Joi.object({
            state_or_town: Joi.alternatives(['state', 'town']).required(),
            state_or_town_id: Joi.number().required(),
            job: Joi.string().required(),
            my_lat: Joi.string().required(),
            my_long: Joi.string().required()
        });
        this.newSearchHistory = Joi.object({
            key: Joi.string().max(30).required(),
        });
        this.states = Joi.object().keys({
            name: Joi.string().max(30).required()
        });
        this.newManyStates = Joi.array().items(this.states);
        this.towns = Joi.object().keys({
            state_id: Joi.number().required(),
            name: Joi.string().max(30).required(),
            lat: Joi.string().required(),
            long: Joi.string().required()
        });
        this.newManyTowns = Joi.array().items(this.towns);
        this.newState = Joi.object({
            name: Joi.string().max(30).required(),
        });
        this.updateState = Joi.object({
            name: Joi.string().max(30),
        });
        this.deleteWithId = Joi.object({
            id: Joi.number(),
        });
        this.newTown = Joi.object({
            state_id: Joi.number().required(),
            name: Joi.string().max(30).required(),
            lat: Joi.string().required(),
            long: Joi.string().required()
        });
        this.updateTown = Joi.object({
            state_id: Joi.number(),
            name: Joi.string().max(30),
            lat: Joi.string(),
            long: Joi.string()
        });
        this.updateJob = Joi.object({
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
        this.newWorker = Joi.object({
            job: Joi.string().required(),
            name: Joi.string().min(3).max(50).required(),
            opening_time: Joi.string().min(5).max(6).required(),
            closing_time: Joi.string().min(5).max(6).required(),
            working_days: Joi.string().min(1).max(15).required(),
            logo: Joi.string(),
        });
        this.updateWorker = Joi.object({
            job: Joi.string().max(80),
            opening_time: Joi.string().max(6),
            closing_time: Joi.string().max(6),
            working_days: Joi.string().max(15),
            logo: Joi.string(),
        });
        this.newUser = Joi.object({
            name: Joi.string().max(30).required(),
            occupation: Joi.string().max(50),
            avatar: Joi.string()
        });
        this.updateUser = Joi.object({
            name: Joi.string().max(30),
            occupation: Joi.string().max(50),
            avatar: Joi.string()
        });
        this.updatePasswordStruct = Joi.object({
            old_password: Joi.string().min(5).max(50).required(),
            new_password: Joi.string().min(5).max(50).required()
        });
        this.loginData = Joi.object({
            password: Joi.string().max(50).required(),
            phone: Joi.string().max(15).required(),
        });
    }
    validateEmail(email) {
        const match = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return match.test(String(email).toLowerCase());
    }
    validate(schema) {
        return (req, res, next) => {
            const { error } = schema.validate(req.body);
            if (error)
                return res.status(400).json({ message: error.details[0].message, status: -1 });
            next();
        };
    }
    formatError(er) {
        let errorObj = new Object({});
        for (let key in er.errors) {
            const text = er.errors[key]['message'];
            errorObj[key] = [`${key} ${text.substr(text.indexOf(`\`${key}\``) + `${key}`.length + 3)}`];
        }
        return { message: er.name, errors: errorObj };
    }
}
exports.Validator = Validator;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require('@hapi/joi');
const exported_classes_1 = require("./../app/exported.classes");
class Validator {
    constructor() {
        this.newAccount = Joi.object({
            phone: Joi.string().max(15).required(),
        });
        this.newAgent = Joi.object({
            password: Joi.string().min(5).max(200).required(),
            phone: Joi.string().min(11).max(15).required(),
            type: Joi.alternatives(['user', 'worker']).required()
        });
        this.updateAgent = Joi.object({
            phone: Joi.string().min(11).max(15),
            // web: Joi.boolean(),
            // app: Joi.boolean(),
            type: Joi.alternatives(['user', 'worker'])
        });
        this.newJobSample = Joi.object({
            date_done: Joi.date().required(),
            title: Joi.string().required(),
            file: Joi.object({
                data: Joi.string().required(),
                type: Joi.alternatives(['audio', 'video', 'image', 'pdf', 'link']).required()
            })
        });
        this.newLocation = Joi.object({
            lat: Joi.string().required(),
            long: Joi.string().required(),
            name: Joi.string().max(100).required(),
            image: Joi.string().required(),
            state_id: Joi.number().required(),
            town_id: Joi.string().required(),
        });
        this.updateLocation = Joi.object({
            lat: Joi.string(),
            long: Joi.string(),
            name: Joi.string().max(100),
            image: Joi.string(),
            state_id: Joi.number(),
            town_id: Joi.string(),
        });
        this.newJob = Joi.object({
            worker_id: Joi.number().required(),
            user_id: Joi.string().required(),
            title: Joi.string().max(100).required(),
        });
        this.newSearchHistory = Joi.object({
            key: Joi.string().max(30).required(),
        });
        this.newState = Joi.object({
            name: Joi.string().max(30).required(),
        });
        this.updateState = Joi.object({
            name: Joi.string().max(30),
        });
        this.newTown = Joi.object({
            state_id: Joi.number().required(),
            name: Joi.string().max(30).required(),
        });
        this.updateTown = Joi.object({
            state_id: Joi.number(),
            name: Joi.string().max(30),
        });
        this.updateJob = Joi.object({
            status: Joi.alternatives(['canceled', 'pending', 'doing', 'done_pending', 'done']),
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
            job: Joi.string().max(80).required(),
            business_name: Joi.string().max(50).required(),
            opening_time: Joi.string().max(6).required(),
            closing_time: Joi.string().max(6).required(),
            working_days: Joi.string().max(15).required(),
            business_logo: Joi.string(),
        });
        this.updateWorker = Joi.object({
            job: Joi.string().max(80),
            opening_time: Joi.string().max(6),
            closing_time: Joi.string().max(6),
            working_days: Joi.string().max(15),
            business_logo: Joi.string(),
        });
        this.newUser = Joi.object({
            name: Joi.string().max(30).required(),
            occupation: Joi.string().max(50),
        });
        this.updateUser = Joi.object({
            name: Joi.string().max(30),
            occupation: Joi.string().max(50),
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
    validatePassword(data) {
        return exported_classes_1.auth.comparePassword(data);
    }
    validate(schema) {
        return (req, res, next) => {
            const { error } = schema.validate(req.body);
            if (error)
                return res.status(400).send(error.details[0].message);
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

import { locationModel, AppError } from './../app/exported.classes'

export class LocationController {

	async create(req, res, next) {
		const data = await locationModel.create(next,{ ...req.body, agent_id: req.agent.id })
		if (data) return res.status(201).json({status: 1, data });
	}

	async update(req, res, next) {
		// console.log('48: REQUEST IMAGE', req.body)
		const data = await locationModel.update(next, {...req.body, agent_id: req.agent.id})
		if (data) return res.status(200).json({ status: 1, data })
	}
}

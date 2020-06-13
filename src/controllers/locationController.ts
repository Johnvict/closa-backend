import { locationModel, stateModel, townModel, AppError, agentModel } from './../app/exported.classes'

export class LocationController {

	async create(req, res, next) {
		const data = await locationModel.create(next, { ...req.body, agent_id: req.agent.id })
		const agent = await agentModel.authAgent(req.agent.id);
		if (data) return res.status(201).json({ status: 1, data, agent });
	}

	async update(req, res, next) {
		// console.log('48: REQUEST IMAGE', req.body)
		const data = await locationModel.update(next, { ...req.body, agent_id: req.agent.id })
		if (data) return res.status(200).json({ status: 1, data })
	}

	async states(req, res, next) {
		// console.log('48: REQUEST IMAGE', req.body)
		// const data = await stateModel.getAllWithoutRelation()
		const data = await stateModel.getAll()
		if (data) return res.status(200).json({ status: 1, data })
	}

	async towns(req, res, next) {
		// console.log('48: REQUEST IMAGE', req.body)
		const data = await townModel.findManyWithFilter(next, { state_id: Number(req.params.stateId) })
		if (data) return res.status(200).json({ status: 1, data })
	}
}

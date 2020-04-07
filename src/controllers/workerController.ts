import { workerModel } from './../app/exported.classes'

export class WorkerController {

	async create(req, res) {
		if (req.agent.type != 'worker') return res.status(400).json({ status: -1, message: 'This is not a worker account' })
		workerModel.create({ ...req.body, agent_id: req.agent.id }).then(response => {
			return response.exist ?
				res.status(200).json({ status: -1, data: response.data, exist: true }) :
				res.status(201).json({ status: 1, data: response.data });	
		})
	}

	async update(req, res) {
		if (req.agent.type != 'worker') return res.status(400).json({ status: -1, message: 'This is not a worker account' })
		workerModel.update({...req.body, agent_id: req.agent.id}).then(response => {
			return response ? 
			res.status(200).json({ status: 1, data: response }) :
			res.status(400).json({ status: -1, message: 'error updating business profile'})
		})
	}
}

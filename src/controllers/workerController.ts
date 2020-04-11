import { workerModel, jobSampleModel, AppError } from './../app/exported.classes'

export class WorkerController {

	async create(req, res, next) {
		workerModel.create({ ...req.body, agent_id: req.agent.id }).then(response => {
			return response.exist ?
				res.status(200).json({ status: -1, data: response.data, exist: true }) :
				res.status(201).json({ status: 1, data: response.data });
		})
	}
	async createJobSample(req, res, next) {
		jobSampleModel.create(next, { ...req.body, worker_id: req.agent.otherid }).then(response => {
			if (response) {
				res.status(201).json({ status: 1, data: response });
			}
		})
	}
	async updateFileLink(req, res, next) {
		const whatToSave = {
			url: req.body.fileUrl,
			id: req.params.id,
			job_sample_id: req.params.job_sample_id
		}
		jobSampleModel.saveFileLink(next, whatToSave ).then(response => {
			return response ?
				res.status(200).json({ status: 1, data: response }) :
				res.status(400).json({ status: -1, message: 'error updating file url' })
		})
	}
	async deleteJobSample(req, res, next) {
		jobSampleModel.delete(next, req.body.id).then(response => {
			if (response) {
				res.status(201).json({ status: 1, data: 'job sample deleted successfully' });
			}
		})
	}

	async update(req, res) {
		workerModel.update({ ...req.body, agent_id: req.agent.id }).then(response => {
			return response ?
				res.status(200).json({ status: 1, data: response }) :
				res.status(400).json({ status: -1, message: 'error updating business profile' })
		})
	}
}

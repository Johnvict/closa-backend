import { jobModel, AppError } from './../app/exported.classes'

export class JobController {

	async create(req, res, next) {
		if (await this.isThisAgentAllowed(req, res, next, 'create')) {
			const data = await jobModel.create(next, req.body)
			if (data) return res.status(201).json({status: 1, data });
		}
	}

	async getMore(req, res, next) {
		if (await this.isThisAgentAllowed(req, res, next, 'access')) {
			const data = await jobModel.getMore({page: req.body.page, user_id: req.body.user_id, worker_id: req.body.worker_id })
			if (data) return res.status(200).json({status: 1, ...data });
		}
	}
	async jobsByStatusFrom(req, res, next) {
		const data = await jobModel.jobsStatusFrom(req.body)
		if (data) return res.status(200).json({status: 1, ...data });
	}

	async jobsStatusWithTitleFrom(req, res, next) {
		const data = await jobModel.jobsStatusWithTitleFrom(req.body)
		if (data) return res.status(200).json({status: 1, ...data });
	}
	
	async getAllJobs(req, res, next) {
		const data = await jobModel.getAll()
		if (data) return res.status(200).json({status: 1, ...data });
	}
	
	async update(req, res, next) {
		console.table(req.body)
		// if (await this.isThisAgentAllowed(req, res, next, 'update')) {
			const data = await jobModel.update(next, req.body)
			if (data) return res.status(200).json({ status: 1, data })
		// }
	}

	isThisAgentAllowed(req, res, next, action: 'create' | 'update' | 'access') {
		const thisLogedInId = req.agent.id;
		if(req.body.user_id !== thisLogedInId && req.body.worker_id !== thisLogedInId) return next(new AppError(`Access denied, you cannot ${action} this job with this account`, 401, -1));
		return true
	}
}

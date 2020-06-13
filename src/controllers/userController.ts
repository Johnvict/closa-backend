import { userModel, AppError } from './../app/exported.classes'

export class UserController {

	async create(req, res, next) {
		if (req.agent.type != 'user') return next(new AppError('This is not a user account', 400, -1))
		const data = await userModel.create(next,{ ...req.body, agent_id: req.agent.id })
		if (data) {
			return res.status(201).json({status: 1, data });
		}
	}

	async update(req, res, next) {
		console.log('\n\n\n\n\n DATA TO STORE',);
		console.table(req.body);
		console.log('\n\n\n\n\n DATA TO STORE',);
		if (req.agent.type != 'user') return next(new AppError('This is not a user account', 400, -1))
		return res.status(200).json({ status: 1, data: await userModel.update(next, {...req.body, agent_id: req.agent.id}) })
	}

}

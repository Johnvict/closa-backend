import { LoginStruct } from './../misc/structs';
import { auth, agentModel, AppError } from './../app/exported.classes'

export class AgentController {

	// For a super admin who wants to see all registered user
	async allAgents(req, res, next) {
		const agents = await agentModel.getAll(next)
		return res.status(200).json({
			status: 1,
			...agents
		})
	}
	async oneAgent(req, res, next) {
		const agent = await agentModel.getOne(next, req.params.id, true)
		if (agent) {
			return res.status(200).json({
				status: 1,
				data: agent
			})
		}
	}
	async allAgentsMore(req, res, next) {
		const agents = await agentModel.getAllMore(req.body)
		return res.status(200).json({
			status: 1,
			...agents
		})
	}


	async create(req, res, next) {
		const newAgent = await agentModel.createAgent(req.body, res, next);
		console.log(`\n\n\n`, newAgent, `\n\n\n`);
		if (newAgent) {
			if (req.agent) {
				const agent = await agentModel.authAgent(req.agent.id);
				return res.status(201).json({
					status: 1,
					data: newAgent,
					agent
				})
			}
			return res.status(201).json({
				status: 1,
				message: 'hello ',
				data: newAgent,
			})
		}
	}


	async update(req, res, next) {
		const id = req.agent.id;		// ? Do not worry, newAgentMiddleware added the agent->id already
		const isToken = req.body.token;
		agentModel.update(next, { ...req.body }, isToken, id).then(async response => {
			const agent = await agentModel.authAgent(id);
			if (response) return res.status(200).json({ status: 1, data: response, agent })
		})
	}

	async delete(req, res, next) {
		return res.status(200).json({
			status: 1,
			data: await agentModel.update(next, { active: false }, req.agent.id)
		})
	}

	async login(req, res, next) {
		const loginData: LoginStruct = req.body;
		const userData = await agentModel.findOneWithFilter(next, { phone: loginData.phone }, 'invalid credentials')
		if (userData) {
			if (!userData.password) return next(new AppError('please create your account completely', 400, -1))
			if (await auth.comparePassword(next, { candidatePassword: loginData.password, hashedPassword: userData.password })) {
				const otherid = userData.business ? userData.business.id : userData.profile ? userData.profile.id : 0;
				res.status(200).json({
					status: 1,
					token: auth.generateToken(userData.id, userData.phone, userData.type, otherid),
					data: userData
				})
				return this.upDateLoginTime(userData.id, userData.phone, next);
			}
		}
	}

	upDateLoginTime(id, phone, next) {
		agentModel.update(next, { active: true, lastLoginAt: Date.now(), phone: phone }, null, id);
	}

	async changePassword(req: any, res, next) {
		let { old_password, new_password } = req.body;
		let agent = await agentModel.findOneWithFilter(next, { id: req.agent.id }, 'invlid credentials')
		if (auth.comparePassword(next, { candidatePassword: old_password, hashedPassword: agent.password }, true)) {
			agentModel.update(next, { password: new_password }, agent.id).then(response => {
				console.log(response)
				if (response) return res.status(200).json({ status: 1, data: response });
			})
		}
	}
}

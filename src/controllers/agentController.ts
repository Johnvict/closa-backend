import { LoginStruct, Agent } from './../misc/structs';
import { auth, agentModel } from './../app/exported.classes'

export class AgentController {

	// For a super admin who wants to see all registered user
	allAgents(req, res) {
		agentModel.getAll().then(response => {
			return response.error ? res.status(400).json({
				status: -1,
				message: response.error
			}) : res.status(200).json({
				status: 1,
				data: response.data
			})
		})
	}



	async create(req, res) {
		agentModel.createAgent(req.body).then(response => {
			return response.exist ? 
				res.status(200).json({ status: -1, data: response.data, exist: true }) : 
				res.status(201).json({ status: 1, data: response.data });
		})
	}

	async update(req, res) {
		agentModel.update({ ...req.body }, req.agent?.id ?? null).then(response => {
			return response.error ? 
			res.status(400).json({status: -1, message: response.error}) : 
			res.status(200).json({ status: 1, data: response.data })
		})
	}

	// We don't want to delete the user account, but change it to { active: false }
	delete(req, res) {
		agentModel.update({ active: false }, req.agent.id).then(response => {
			return response.error ?
				res.status(400).json({ status: -1, message: response.error }) :
				res.status(200).json({ status: 1, data: response.data });
		})
	}

	async login(req, res) {
		const loginData: LoginStruct = req.body;
		agentModel.findOneWithFilter({ phone: loginData.phone }).then( response => {
			if (response.data) {
				if (!auth.comparePassword({
					candidatePassword: loginData.password,
					hashedPassword: response.data.password
				})) return res.status(401).json({ status: '-1', message: 'invalid credentials' });
				res.status(200).json({
					status: 1,
					token: auth.generateToken(response.data.id, response.data.phone, response.data.type),
					data: response.data
				})
				return this.upDateLoginTime(response.data.id);
			}
			return res.status(401).json({ status: -1, message: 'invalid credentials' });
		});
	}

	upDateLoginTime(id) {
		agentModel.update({ active: true, lastLoginAt: Date.now() }, id);
	}

	async changePassword(req: any, res) {
		let { old_password, new_password} = req.body;
		let agent = await agentModel.findOneWithFilter({id: req.agent.id })
		if (agent.data) {
			const isOldPasswordValid = auth.comparePassword({candidatePassword: old_password, hashedPassword: agent.data.password});
			if (!isOldPasswordValid) return res.status(401).json({ status: -1, message: 'old password is invalid' });	
			agentModel.update({password: new_password }, agent.data.id).then( response => {
				return response.error ? res.status(401).json({ status: -1, message: response.error }) : res.status(201).json({ status: 1, data: agent.data });
			})
		}
	}
}

import { NewAgent, NewPhone, Agent, UpdateAgent, NewToken } from './../misc/structs';
import { GenericObject, UserStruct } from "../misc/structs"
import { auth, DbModel, AppError, tokenModel } from './../app/exported.classes'

const Op = require('sequelize').Op;

export class AgentModel {
	duplicateExist = false;
	agentRelations = [
		{ model: DbModel.User, as: 'profile', },
		{
			model: DbModel.Worker, as: 'business', include: [
				{
					model: DbModel.JobSample, as: 'job_samples', include: [
						{ model: DbModel.File, as: 'file' }
					]
				}
			]
		},

		{ model: DbModel.Job, as: 'worker_jobs', limit: 10, order: [['updatedAt', 'DESC']], include: [this.getUserWorkerRelation('user'), this.getUserWorkerRelation('worker')] },
		{ model: DbModel.Job, as: 'user_jobs', limit: 10, order: [['updatedAt', 'DESC']], include: [this.getUserWorkerRelation('user'), this.getUserWorkerRelation('worker')] },
		{ model: DbModel.SearchHistory, as: 'search_histories' },
		{
			model: DbModel.Location, as: 'location', include: [
				{ model: DbModel.State, as: 'state' },
				{ model: DbModel.Town, as: 'town' }
			]
		},
	];

	getUserWorkerRelation(who: 'worker' | 'user') {
		return {
			model: DbModel.Agent, as: who,
			include: [
				{ model: who == 'user' ? DbModel.User : DbModel.Worker, as: who == 'user' ? 'profile' : 'business' },
				{
					model: DbModel.Location, as: 'location', include: [
						{ model: DbModel.State, as: 'state' },
						{ model: DbModel.Town, as: 'town' }
					]
				}
			]
		}
	}
	constructor() { }

	async createAgent(next, newAgent: NewPhone): Promise<NewAgent> {
		return DbModel.Agent.findOrCreate({
			where: { [Op.or]: [{ phone: newAgent.phone }] },
			defaults: newAgent
		}).then(async (queryRes) => {
			if (queryRes[1]) {
				const token: NewToken = await this.generateToken(queryRes[0].id)
				tokenModel.create(next, token)
				return await { ...token, ...this.getOne(next, queryRes[0].id) }
			}
			next(new AppError('account already exists', 400, -1))
		}).catch(e => console.log(e));
	}

	async generateToken(agent_id: number): Promise<NewToken> {
		const nums = [1, 9, 3, 8, 0, 5, 4, 7, 2, 6];
		const genToken = () => {
			let token = ""
			for (let i = 1; i <= 6; i++) {
				token += nums[Math.floor(Math.random() * 9)]
			}
			return token
		}

		return {
			agent_id,
			expireAt: new Date(Date.now() + 900000),
			token: genToken()
		}
	}


	async getOne(next, id: number): Promise<Agent> {
		try {
			const data = await DbModel.Agent.findByPk(id, { include: this.agentRelations });
			return data ? data : next(new AppError('no account found with this credential', 500))
		} catch (err) {
			return next(err.message)
		}
	}

	async getAll(next): Promise<Agent[]> {
		const users = await DbModel.Agent.findAll({ include: this.agentRelations })
		return users ? users : next(new AppError('no user found', 400, -1))
	}

	async findOneWithFilter(next, filterArgs: GenericObject, message?): Promise<Agent> {
		const agent = await DbModel.Agent.findOne({ where: filterArgs })
		if (!agent) return next(new AppError(message, 400, -1));
		return await this.getOne(next, agent.id);
	}

	async whatToUpdate(next, agent, isToken, id): Promise<GenericObject> {
		const newData = {}
		try {
			for (let key in agent) {
				if (key == 'password') agent[key] = auth.hashPassword(agent[key]);
				newData[key] = agent[key]
				if (!isToken) {
					if (key == 'email') {
						if (await this.checkDuplicate(next, (agent.email as string), key, (agent.phone as string))) return this.reportDuplicate(next, key)
					}
					if (key == 'phone') {
						if (await this.checkDuplicate(next, (agent.phone as string), key, (agent.phone as string), id)) return this.reportDuplicate(next, key)
					}
					if (key == 'username') {
						if (await this.checkDuplicate(next, (agent.username as string).toLowerCase(), key, (agent.phone as string))) return this.reportDuplicate(next, key)
					}
				}
			}
		} catch (error) {
			console.table({ ERROR: error })
		}
		return newData
	}

	// return DbModel.Worker.findOrUpdate({
	// 	where: {[Op.or]: [{phone}, {email}, {username}]},
	// 	defaults: { ...dataToStore }
	// })

	async checkDuplicate(next, value: string, key: string, phone: string, id?): Promise<boolean> {
		let exist = false;
		const agent = await DbModel.Agent.findOne({ where: { [key]: value } })
		if (agent) {
			if (key === 'phone') {
				if (agent.id !== id && agent.phone == value) exist = true
			} else {
				if (agent.phone !== phone) exist = true
			}
		}
		return exist
	}

	async update(next: any, agent: UpdateAgent, isToken, id?: number, ): Promise<UserStruct | any> {
		this.duplicateExist = false;
		const dataToStore = await this.whatToUpdate(next, agent, isToken, (id as number));
		if (this.duplicateExist) return
		let data, exist;
		const getAgentData = async () => {
			if (isToken) {
				data = await this.findOneWithFilter(next, { [Op.and] : [{phone: agent.phone}, {id}] })
				exist = data.password ? true : false;
				if (!data) return next(new AppError('Invalid credentials submitted', 400, -1))
			} else {
				data = await this.getOne(next, id as number)
			}
			return data
		}
		await getAgentData();

		if (exist) return next(new AppError('Account creation is already done', 400, -1))
		if (!isToken) delete dataToStore['type'];		// ? The agent already created account completely, they can't change account type again
		return DbModel.Agent.update(dataToStore, { returning: true, where: id ? { id } : { phone: agent.phone } })
			.then(async (updatedUser) => {
				await getAgentData();
				if (isToken) tokenModel.delete(id as number);
				return updatedUser ? data : next(new AppError('No account found with specified credentials', 400, -1))
			})
			.catch(e => console.log(e))
	}

	reportDuplicate(next, value) {
		this.duplicateExist = true;
		return next(new AppError(`this ${value} is taken`, 400, -1))
	}
}
import { NewAgent, NewPhone, Agent, UpdateAgent, NewToken } from './../misc/structs';
import { GenericObject, UserStruct } from "../misc/structs"
import { auth, DbModel, AppError, tokenModel } from './../app/exported.classes'

// const Op = require('sequelize').Op;
import { Op, Sequelize } from 'sequelize';  
import sequelize from 'sequelize';

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
		{ model: DbModel.SearchHistory, as: 'search_histories', attributes: ['key'], order: [['updatedAt', 'DESC']] },
		{
			model: DbModel.Location, as: 'location', include: [
				{ model: DbModel.State, as: 'state', attributes: ['name', 'id'] },
				{ model: DbModel.Town, as: 'town', attributes: ['name', 'id', 'state_id'] }
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
			const token: NewToken = await this.generateToken(queryRes[0].id)
			tokenModel.create(next, token)
			console.log('QUERY-RESPONSE-0', queryRes[0]);
			console.log('QUERY-RESPONSE-1', queryRes[1]);
			return await { data: queryRes[0] }
			// return await { token: token, data: ...this.getOne(next, queryRes[0].id) }
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


	async getOne(next, id: number, fromAdmin?: boolean): Promise<Agent> {
		try {
			const data = await DbModel.Agent.findByPk(id, { include: this.agentRelations });
			return data ? data : next(fromAdmin ? new AppError('no account found with this credential', 400, -1) : new AppError('no account found with this credential', 500))
		} catch (err) {
			return next(err.message)
		}
	}

	async authAgent(id: number): Promise<Agent | any> {
		try {
			const data = await DbModel.Agent.findByPk(id, { include: this.agentRelations });
			return data
		} catch (err) {
			// log Error
			// return next(err.message)
			return
		}
	}

	async getAll(next): Promise<Agent[]> {
		return DbModel.Agent.findAndCountAll({ order: [['updatedAt', 'DESC']], limit: 20, include: this.agentRelations }).then( result => {
			const isLastPageNoMore = result.count >= 20 ? false : true;
			return { total: result.count, lastPage: isLastPageNoMore, more: !isLastPageNoMore, data: result.rows }
		});
	}

	async getAllMore(filter: {page: number, sort: 'desc' | 'asc'}): Promise<{ data: Agent[], total: number, lastPage: boolean }> {
		const sort = filter.sort ? filter.sort : 'desc';
		return DbModel.Agent.findAndCountAll({
			order: [['updatedAt', sort]],
			limit: 1,
			offset: 1 * filter.page,
			include: this.agentRelations
		}).then(result => {
			const pageIncMonitor = (filter.page + 2) * 1;
			const isLastPageNoMore = result.count >= pageIncMonitor ? false : true;
			return { total: result.count, lastPage: isLastPageNoMore, more: !isLastPageNoMore, data: result.rows }
		})
	}

	async findOneWithFilter(next, filterArgs: GenericObject, message?): Promise<Agent> {
		const agent = await DbModel.Agent.findOne({ where: filterArgs })
		if (!agent) return next(new AppError(message, 400, -1));
		return await this.getOne(next, agent.id);
	}

	async whatToUpdate(next, agent, id): Promise<GenericObject> {
		const newData = {}
		try {
			for (let key in agent) {
				if (key == 'password') agent[key] = auth.hashPassword(agent[key]);
				newData[key] = agent[key]
				if (key == 'email' || key == 'phone' || key == 'username') {
					if (await this.checkDuplicate((agent[key] as string), key, id)) return this.reportDuplicate(next, key)
				}
			}
		} catch (error) {
			console.table({ ERROR: error })
		}
		return newData
	}

	async checkDuplicate(value: string, key: string, id?): Promise<boolean> {
		const agent = await DbModel.Agent.findOne({ where: { [Op.and]: [{ [key]: value }, { id: {[Op.ne]: id} }] }})
		return agent ? true : false
	}

	/**
	 * 
	 * @param next 
	 * @param agent data to update 
	 * @param isToken in an event where token is provided, for a new agent account
	 * @param id agent id
	 */
	async update(next: any, agent: UpdateAgent, isToken, id?: number, ): Promise<UserStruct | any> {
		this.duplicateExist = false;
		const dataToStore = await this.whatToUpdate(next, agent, (id as number));
		if (this.duplicateExist) return
		let data; // exist;
		const getAgentData = async () => {
			if (isToken) {
				data = await this.findOneWithFilter(next, { [Op.and] : [{phone: agent.phone}, {id}] })
				// exist = data.password ? true : false;
				if (!data) return next(new AppError('Invalid credentials submitted', 400, -1))
			} else {
				data = await this.getOne(next, id as number)
			}
			return data
		}
		await getAgentData();

		// if (exist) return next(new AppError('Account creation is already done', 400, -1))
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
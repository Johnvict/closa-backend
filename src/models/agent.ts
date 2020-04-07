import { NewAgent, NewPhone, Agent, UpdateAgent } from './../misc/structs';
import { GenericObject, UserStruct } from "../misc/structs"
import { auth, DbModel } from './../app/exported.classes'

const Op = require('sequelize').Op;

export class AgentModel {
	agentRelations = [
		{ model: DbModel.User, as: 'profile' },
		{
			model: DbModel.Worker, as: 'business', include: [
				{
					model: DbModel.JobSample, as: 'job_samples', include: [
						{ model: DbModel.File, as: 'file' }
					]
				}
			]
		},
		{ model: DbModel.Job, as: 'worker_jobs' },
		{ model: DbModel.Job, as: 'user_jobs' },
		{ model: DbModel.SearchHistory, as: 'search_histories' },
		{
			model: DbModel.Location, as: 'location', include: [
				{ model: DbModel.State, as: 'state' },
				{ model: DbModel.Town, as: 'town' }
			]
		},
	];
	constructor() { }

	async createAgent(newAgent: NewPhone): Promise<{ exist: false, data?: NewAgent }> {
		return DbModel.Agent.findOrCreate({
			where: { [Op.or]: [{ phone: newAgent.phone }] },
			defaults: newAgent
		}).then(async (queryRes) => {
			if (queryRes[1]) return { data: await this.getOne(queryRes[0].id) }
			return { exist: true, data: await this.findOneWithFilter({ phone: newAgent.phone }) }
		}).catch(e => console.log(e));
	}


	async getOne(id: number): Promise<{ error?: any, data?: Agent }> {
		try {
			const data = await DbModel.Agent.findByPk(id, { include: this.agentRelations });
			console.log(data);
			return { data };
		} catch (err) {
			console.log(err.message)
			return { error: 'server error' };
		}
	}

	async getAll(): Promise<{ error?: string, data?: Agent[] }> {
		const users = await DbModel.Agent.findAll({ include: this.agentRelations })
		return users ? { data: users } : { error: 'no user found' }
	}

	async findOneWithFilter(filterArgs: GenericObject): Promise<{ error?: any, data?: Agent }> {
		const agent = await DbModel.Agent.findOne({ where: filterArgs })
		if (!agent) return { error: null };
		return { data: await this.getOne(agent.id).then(data => data.data) };
	}

	whatToUpdate(user): GenericObject {
		const newData = {}
		for (let key in user) {
			if (key == '_id') continue
			if (key == 'password') user[key] = auth.hashPassword(user[key]);
			newData[key] = user[key]
		}
		return newData
	}

	async update(agent: UpdateAgent, id?: number): Promise<{ error?: string, data?: UserStruct }> {
		const dataToStore = this.whatToUpdate(agent);
		let data
		const getAgentData = async (first = true) => {
			if (id) {
				data = await this.getOne(id as number)
			} else {
				data = await this.findOneWithFilter({ phone: agent.phone }).then(data => data.data)
				if (data.password) return { error: 'Account creation is already done' }
			}
		}
		await getAgentData();
		return DbModel.Agent.update(dataToStore, { returning: true, where: id ? { id } : { phone: agent.phone } })
		.then(async (updatedUser) => {
				await getAgentData(false);
				return updatedUser ? { data } : { error: 'No account found with specified credentials' }
			})
			.catch(e => console.log(e))
	}

}
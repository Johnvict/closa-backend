import { GenericObject, UserStruct, UpdateUserAccount } from "../misc/structs"
import { auth, DbModel } from './../app/exported.classes'

const Op = require('sequelize').Op;

export class UserModel {
	userRelations = [
		{ model: DbModel.User, as: 'profile' },
		{ model: DbModel.Worker, as: 'business' },
		{
			model: DbModel.Location, as: 'location', include: [
				{ model: DbModel.State, as: 'state' },
				{ model: DbModel.Town, as: 'town' }
			]
		},
	];
	constructor() { }

	async create(newUser: UserStruct): Promise<{ error?: GenericObject, data?: UserStruct }> {
		newUser.password = auth.hashPassword(newUser.password);
		return DbModel.Agent.findOrCreate({
			where: { [Op.or]: [{ phone: newUser.phone }] },
			defaults: newUser
		}).then(async (queryRes) => {
			if (queryRes[1]) return { data: await this.getOne(queryRes[0].id) }
			return { error: "data already exists" }
		}).catch(e => console.log(e));
	}

	async getOne(id: number): Promise<{ error?: any, data?: UserStruct }> {
		try {
			return { data: await DbModel.Agent.findByPk(id, { include: this.userRelations }) };
			// return { data: await DbModel.State.findByPk(id, { include: {model: DbModel.Location, as: 'state'} }) };
		} catch (err) {
			console.log(err.message)
			return { error: 'server error' };
		}
	}

	async getAll(): Promise<{ error?: string, data?: UserStruct[] }> {
		const users = await DbModel.Agent.findAll()
		return users ? { data: users } : { error: 'no user found' }
	}

	async findOneWithFilter(filterArgs: GenericObject) {
		return await DbModel.Agent.findOne({ where: filterArgs })
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

	async update(user: UpdateUserAccount): Promise<{ error?: string, data?: UserStruct }> {
		const dataToStore = this.whatToUpdate(user);
		return DbModel.Agent.update(dataToStore, { returning: true, where: { id: dataToStore.id } })
			.then(async (updatedUser) => {
				const userData = await this.getOne(user.id);
				return updatedUser ? { data: userData } : { error: 'No account found with this id' }
			})
			.catch(e => console.log(e))
	}



}
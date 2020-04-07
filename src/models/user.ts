import { GenericObject, UserStruct, NewUser, UpdateUser } from './../misc/structs';
import { DbModel } from './../app/exported.classes'

const Op = require('sequelize').Op;

export class UserModel {
	constructor() { }

	async create(newUser: NewUser): Promise<{ exist: false, data?: UserStruct }> {
		return DbModel.User.findOrCreate({
			where: { [Op.or]: [{ agent_id: newUser.agent_id }] },
			defaults: newUser
		}).then(async (queryRes) => {
			if (queryRes[1]) return { data: await this.getOne(queryRes[0].id) }
			return { exist: true, data: await this.findOneWithFilter({agent_id: newUser.agent_id}) }
		}).catch(e => console.log(e));
	}

	async getOne(id: number): Promise<UserStruct> {
		return await DbModel.User.findByPk(id);
	}

	async findOneWithFilter(filterArgs: GenericObject): Promise<UserStruct> {
		return await DbModel.User.findOne({ where: filterArgs })
	}

	whatToUpdate(user): GenericObject {
		const newData = {}
		for (let key in user) {
			newData[key] = user[key]
		}
		return newData
	}

	async update(user: UpdateUser): Promise<UserStruct> {
		const dataToStore = this.whatToUpdate(user);
		return DbModel.User.update(dataToStore, { returning: true, where: { agent_id: user.agent_id } })
			.then(async _ => {
				return await this.findOneWithFilter({agent_id: user.agent_id});
			})
			.catch(e => console.log(e))
	}
}

import { GenericObject, UserStruct, NewUser, UpdateUser } from './../misc/structs';
import { DbModel, AppError } from './../app/exported.classes'

// const Op = require('sequelize').Op;

import { Op, Sequelize } from 'sequelize';  
import sequelize from 'sequelize';

export class UserModel {
	constructor() { }

	async create(next, newUser: NewUser): Promise<UserStruct> {
		return DbModel.User.findOrCreate({
			where: { [Op.or]: [{ agent_id: newUser.agent_id }] },
			defaults: newUser
		}).then(async (queryRes) => {
			if (queryRes[1]) return await this.getOne(next, queryRes[0].id)
			return next(new AppError('user profile already created', 400, -1))
		}).catch(e => console.log(e));
	}

	async getOne(next, id: number): Promise<UserStruct> {
		return await DbModel.User.findByPk(id);
	}

	async findOneWithFilter(next, filterArgs: GenericObject): Promise<UserStruct> {
		const user = await DbModel.User.findOne({ where: filterArgs })
		return user ? user : next(new AppError('no user account found with this credential', 400, -1)) 
	}

	whatToUpdate(user): GenericObject {
		const newData = {}
		for (let key in user) {
			newData[key] = user[key]
		}
		return newData
	}

	async update(next, user: UpdateUser): Promise<UserStruct> {
		const dataToStore = this.whatToUpdate(user);
		console.log('\n\n\n\n\n DATA TO STORE',);
		console.table(dataToStore);
		console.log('\n\n\n\n\n DATA TO STORE',);
		return DbModel.User.update(dataToStore, { returning: true, where: { agent_id: user.agent_id } })
			.then(async _ => {
				return await this.findOneWithFilter(next, {agent_id: user.agent_id});
			})
			.catch(e => console.log(e))
	}
}

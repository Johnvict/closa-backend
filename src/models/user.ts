import { GenericObject, UserStruct, UpdateUserAccount } from "../misc/structs"
import { auth } from './../app/exported.classes'
const User = require('./definition/User')
const Op = require('sequelize').Op;

export class UserModel {
	constructor() { }

	async create(newUser: UserStruct): Promise<{ error?: GenericObject, data?: UserStruct }> {
		newUser.password = auth.hashPassword(newUser.password);
		return User.findOrCreate({
			where: { [Op.or]: [{ phone: newUser.phone }] },
			defaults: newUser
		}).then(async (queryRes) => {
			if (queryRes[1]) return { data: await this.getOne(queryRes[0].id) }
			return { error: "data already exists" }
		}).catch(e => console.log(e));
	}

	async getOne(id: number) {
		return await User.findByPk(id).then(data => data);
		// return await User.findByPk(id, {include: { model: TransactionLog, as: "transactionLogs" }}).then( data => data);
	}

	async getAll(): Promise<{ error?: string, data?: UserStruct[] }> {
		const users = await User.findAll()
		return users ? { data: users } : { error: 'no user found' }
	}

	async findOneWithFilter(filterArgs: GenericObject) {
		return await User.findOne({where: filterArgs})
	}

	whatToUpdate(user): GenericObject {
		const newData = {}
		for (let key in user) {
			if (key == '_id') continue
			if(key == 'password') user[key] = auth.hashPassword(user[key]);
			newData[key] = user[key]
		}
		return newData
	}

	async update(user: UpdateUserAccount): Promise<{ error?: string, data?: UserStruct }> {
		const dataToStore = this.whatToUpdate(user);
		return User.update(dataToStore, { returning: true, where: { id: dataToStore.id } })
			.then(async (updatedUser) => {
				const userData = await this.getOne(user.id);
				return updatedUser ? { data: userData } : { error: 'No user found with this id' }
			})
			.catch(e => console.log(e))
	}



}
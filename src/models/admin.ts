import { GenericObject, Admin, NewAdmin, UpdateAdmin } from './../misc/structs';
import { DbModel, AppError, auth } from './../app/exported.classes';
import { Sequelize } from '../../models';
const sequelize = require("sequelize");

const Op = require('sequelize').Op;

export class AdminModel {
	constructor() { }
	async create(next, newAdmin: NewAdmin): Promise<Admin> {
		newAdmin.password = auth.hashPassword(newAdmin.password);
		for (let key in newAdmin) {
			if (key == 'username' || key == 'email' || key == 'phone') {
				if (await this.checkUniquenessExistence(newAdmin[key], key)) {
					return next((new AppError(`this ${key} is already taken`, 400, -1)));
				}
			}
		}
		const [admin, created] = await DbModel.Admin.findOrCreate({
			where: { [Op.or]: [{ username: newAdmin.username }, { phone: newAdmin.phone }, { email: newAdmin.email }] },
			defaults: newAdmin
		});
		
		if (created) return await this.getOne(next, admin.id)
		return admin
	}

	async getOne(next, id: number): Promise<Admin> {
		return await DbModel.Admin.findByPk(id);
	}

	async getAll(): Promise<Admin> {
		return await DbModel.Admin.findAll();
	}

	async delete(next, id: number): Promise<any> {
		try {
			const data = await DbModel.Admin.destroy({ where: { id } })
			console.log(data)
			return data < 1 ? next(new AppError('no admin data found with this credential', 400, -1)) : true
		} catch (err) {
			return next(err.message)
		}
	}

	async findOneWithFilter(next, filterArgs: GenericObject): Promise<Admin> {
		const admin = await DbModel.Admin.findOne({ where: filterArgs })
		return admin ? admin : next(new AppError('no admin data found with this credential', 400, -1))
	}

	async whatToUpdate(next, data, id): Promise<GenericObject | false> {
		const newData = {}
		for (let key in data) {
			if (key == 'phone' || key == 'email' || key == 'username') {
				if (await this.checkUniquenessExistence(data[key], key, id)) {
					next((new AppError(`this ${key} is already taken`, 400, -1)));
					return false;
				}
			}
			if (key == 'password') data[key] = auth.hashPassword(data.password)
			newData[key] = data[key]
		}
		return newData
	}

	async checkUniquenessExistence(value: string, key: string, id?): Promise<boolean> {
		const admin = id 
			? await DbModel.Admin.findOne({ where: { [Op.and]: [{ [key]: value }, { id: {[Op.ne]: id} }] }})
			: await DbModel.Admin.findOne({ where: { [key]: value } })
		return admin ? true : false
	}

	async update(next, data: UpdateAdmin): Promise<Admin | null> {
		const admin = await this.getOne(next, data.id)
		if (!admin) return next(new AppError('no admin data found with this credential', 400, -1))
		const dataToStore = await this.whatToUpdate(next, data, data.id);
		if (typeof dataToStore == 'boolean') return null;
		return DbModel.Admin.update(dataToStore, { returning: true, where: { id: data.id } })
		.then(async _ => {
			return await this.getOne(next, (data.id as number));
		})
		.catch(e => console.log(e))
	}
}

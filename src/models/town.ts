import { GenericObject, NewUpdateTown, Town } from './../misc/structs';
import { DbModel, AppError } from './../app/exported.classes';

// const sequelize = require("sequelize");
// const Op = require('sequelize').Op;

import { Op, Sequelize } from 'sequelize';  
import sequelize from 'sequelize';

export class TownModel {
	constructor() { }

	townRelations = { model: DbModel.State, as: 'state' }
	async create(next, newTown: NewUpdateTown): Promise<Town> {
		// const existed: Town = await this.ifTownExists(next, newTown);
		// if (!existed) {
			const [town, created] = await DbModel.Town.findOrCreate({
				where: { [Op.or]: [{ name: newTown.name }] },
				defaults: newTown
			});
			if (created) return await this.getOne(next, town.id)
			return town
		// }
		// return existed;
	}

	async ifTownExists(next, newTown: NewUpdateTown) {
		const withCaseInsensitive = sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', `%${newTown.name}%`);
		const { count, rows } = await DbModel.Town.findAndCountAll({
			where: {
				[Op.and]: [
					{ name: withCaseInsensitive },
					// { name: { [Op.like]: `%${newTown.name}%` } },
					{ state_id: newTown.state_id },
				]
			},
			offset: 10,
			limit: 1
		});
		if (count > 0) return await DbModel.Town.findOne({ where: {name: withCaseInsensitive } })
		return null;
	}


	async getOne(next, id: number): Promise<Town> {
		return await DbModel.Town.findByPk(id);
	}

	async getAll(): Promise<Town> {
		return await DbModel.Town.findAll({ include: this.townRelations });
	}

	async delete(next, id: number): Promise<any> {
		try {
			DbModel.Town.destroy({ where: { id } }).then(data => {
				return data < 1 ? next(new AppError('data not found', 400, -1)) : true
			});
		} catch (err) {
			return next(err.message)
		}
	}

	async findOneWithFilter(next, filterArgs: GenericObject): Promise<Town> {
		const town = await DbModel.Town.findOne({ where: filterArgs })
		return town ? town : next(new AppError('no town data found with this credential', 400, -1))
	}
	async findManyWithFilter(next, filterArgs: GenericObject): Promise<Town> {
		const town = await DbModel.Town.findAll({ where: filterArgs })
		return town ? town : next(new AppError('no town data found with this credential', 400, -1))
	}

	whatToUpdate(data): GenericObject {
		const newData = {}
		for (let key in data) {
			newData[key] = data[key]
		}
		return newData
	}

	async update(next, data: NewUpdateTown): Promise<Town> {
		const dataToStore = this.whatToUpdate(data);
		const town = this.getOne(next, (data.id as number))
		if (!town) return next(new AppError('no town data found with this credential', 400, -1))
		return DbModel.Town.update(dataToStore, { returning: true, where: { id: data.id } })
			.then(async _ => {
				return await this.getOne(next, (data.id as number));
			})
			.catch(e => console.log(e))
	}
}

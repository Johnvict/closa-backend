import { GenericObject, NewUpdateState, State } from './../misc/structs';
import { DbModel, AppError } from './../app/exported.classes';
const sequelize = require("sequelize");

const Op = require('sequelize').Op;

export class StateModel {
	constructor() { }

	stateRelations = { model: DbModel.Town, as: 'towns' }
	async create(next, newState: NewUpdateState): Promise<State> {
		const [state, created] = await DbModel.State.findOrCreate({
			where: { [Op.or]: [{ name: newState.name }] },
			defaults: newState
		});
		if (created) return await this.getOne(next, state.id)
		return state
	}

	async ifStateExists(next, newState: NewUpdateState) {
		const withCaseInsensitive = sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', `%${newState.name}%`);
		const { count, rows } = await DbModel.State.findAndCountAll({
			where: {
				[Op.and]: [
					{ name: withCaseInsensitive },
				]
			},
			offset: 10,
			limit: 1
		});
		if (count > 0) return await DbModel.State.findOne({ where: {name: withCaseInsensitive } })
		return null;
	}


	async getOne(next, id: number): Promise<State> {
		return await DbModel.State.findByPk(id);
	}
	
	async getAll(): Promise<State> {
		return await DbModel.State.findAll({ include: this.stateRelations });
	}

	async delete(next, id: number): Promise<any> {
		try {
			DbModel.State.destroy({ where: { id } }).then(data => {
				return data < 1 ? next(new AppError('data not found', 400, -1)) : true
			});
		} catch (err) {
			return next(err.message)
		}
	}

	async findOneWithFilter(next, filterArgs: GenericObject): Promise<State> {
		const state = await DbModel.State.findOne({ where: filterArgs })
		return state ? state : next(new AppError('no state data found with this credential', 400, -1))
	}

	whatToUpdate(data): GenericObject {
		const newData = {}
		for (let key in data) {
			newData[key] = data[key]
		}
		return newData
	}

	async update(next, data: NewUpdateState): Promise<State> {
		const dataToStore = this.whatToUpdate(data);
		return DbModel.State.update(dataToStore, { returning: true, where: { id: data.id } })
			.then(async _ => {
				return await this.getOne(next, (data.id as number));
			})
			.catch(e => console.log(e))
	}
}

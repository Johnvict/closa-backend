import { NewWorker, GenericObject, WorkerStruct, UpdateWorker } from "./../misc/structs"
import { DbModel } from './../app/exported.classes'

// const Op = require('sequelize').Op;

import { Op, Sequelize } from 'sequelize';  
import sequelize from 'sequelize';

export class WorkerModel {
	constructor() { }

	async create(newWorker: NewWorker): Promise<{ exist: false, data?: WorkerStruct }> {
		return DbModel.Worker.findOrCreate({
			where: { [Op.or]: [{ agent_id: newWorker.agent_id }] },
			defaults: newWorker
		}).then(async (queryRes) => {
			if (queryRes[1]) return { data: await this.getOne(queryRes[0].id) }
			return { exist: true, data: await this.findOneWithFilter({agent_id: newWorker.agent_id}) }
		}).catch(e => console.log(e));
	}

	async getOne(id: number): Promise<WorkerStruct> {
		return await DbModel.Worker.findByPk(id);
	}

	async findOneWithFilter(filterArgs: GenericObject): Promise<WorkerStruct> {
		return await DbModel.Worker.findOne({ where: filterArgs })
	}

	whatToUpdate(user): GenericObject {
		const newData = {}
		for (let key in user) {
			newData[key] = user[key]
		}
		return newData
	}

	async update(worker: UpdateWorker): Promise<WorkerStruct> {
		const dataToStore = this.whatToUpdate(worker);
		return DbModel.Worker.update(dataToStore, { returning: true, where: { agent_id: worker.agent_id } })
			.then(async _ => {
				return await this.findOneWithFilter({agent_id: worker.agent_id});
			})
			.catch(e => console.log(e))
	}
}

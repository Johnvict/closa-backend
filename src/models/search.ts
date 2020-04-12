import { GenericObject, NewSearchHistory, SearchHistory, SearchWorkerFromStateTown } from './../misc/structs';
import { DbModel, AppError } from './../app/exported.classes';

import * as sequelize from 'sequelize'
const Op = sequelize.Op;

export class SearchModel {
	constructor() { }

	// jobRelations = [this.getUserWorkerRelation('user'), this.getUserWorkerRelation('worker')]

	getUserWorkerRelation(who: 'worker' | 'user') {
		return {
			model: DbModel.Agent, as: who,
			include: [
				{ model: who == 'user' ? DbModel.User : DbModel.Worker, as: who == 'user' ? 'profile' : 'business', },
				{
					model: DbModel.Location, as: 'location', include: [
						{ model: DbModel.State, as: 'state' },
						{ model: DbModel.Town, as: 'town' }
					]
				}
			]
		}
	}

	async create(next, newSearchHistory: NewSearchHistory) {
		const [history, created] = await DbModel.SearchHistory.findOrCreate({
			where: {
				[Op.and]: [
					{ agent_id: newSearchHistory.agent_id },
					{ key: newSearchHistory.key }
				]
			},
			defaults: newSearchHistory
		});
		// if (created) return await this.getOne(next, history.id)
		// return history
	}

	async getOne(next, id: number): Promise<SearchHistory> {
		return await DbModel.Job.findByPk(id);
	}


	formatIntoQueryArray(arr: string[]) {
		return arr.map(str => {
			str = this.formatStringToFitRegExcape(str);
			const query = { [Op.regexp]: `.*${str}.*` }
			return query
		})
	}


	sortByDistance() { }

	formatStringToFitRegExcape(theStr) {
		return theStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}

	async convertTitle(title) {
		const skips = ["and", "or", "with", "on", "of", "for", "under", "across", "&", "in", "an"]
		const arr: string[] = title.split(' ')
		await skips.forEach(el => {
			const ind = arr.indexOf(el)
			if (ind >= 0) arr.splice(ind, 1)
			const indexOfNull = arr.indexOf("")
			if (indexOfNull >= 0) arr.splice(indexOfNull, 1)
		});

		return arr;
	}

	async workerWithjobsTitle(filter: SearchWorkerFromStateTown, my_id) {
		const searchKeys = await this.convertTitle(filter.job);
		const filterArg = await this.formatIntoQueryArray(searchKeys)
		return DbModel.Worker.findAll({
			where: {
				[Op.and]: [
					{ status: 'available' },
					{ job: { [Op.or]: filterArg } }
				]
			},
			attributes: ['name', 'logo', 'job', 'agent_id'],
			include: [
				{
					model: DbModel.Agent, as: 'agent', attributes: ['phone'], where: { id: {[Op.ne]: my_id} }, required: true, include: [
						{
							model: DbModel.Location, as: 'location', required: true,
							where: { [`${filter.state_or_town}_id`]: filter.state_or_town_id },
							attributes: ['name', 'image', 'long', 'lat'],
							include: [
								{ model: DbModel.State, as: 'state', attributes: ['name'] },
								{ model: DbModel.Town, as: 'town', attributes: ['name'] }
							]
						},
						{ model: DbModel.Job, as: 'worker_jobs', where: { status: 'done' }, attributes: ['rating'], }
					]
				},
			],
		}).then( async result => {
			return result
		})
	}
	// async jobsStatusFrom(filter: JobByStatusFromStateOrTown) {

	// 	return DbModel.Job.findAndCountAll({
	// 		where: {
	// 			createdAt: { [Op.between]: [filter.start_range ? filter.start_range : 0, filter.end_range ? filter.end_range : Date.now()] },
	// 		},
	// 		include: {
	// 			model: DbModel.Agent, as: 'worker', required: true, include: {
	// 				model: DbModel.Location, as: 'location', required: true, where: { [`${filter.state_or_town}_id`]: filter.state_or_town_id }
	// 			}
	// 		},
	// 		group: ['status']
	// 	}).then(result => {
	// 		const total = result.count.map(el => el.count).reduce((sum, num) => sum + num, 0)
	// 		const regroup = result.count.map(el => ({ ...el, percent: (el.count / total) * 100 }))
	// 		return { total, data: regroup }
	// 	})
	// }





	// async delete(next, id: number): Promise<any> {
	// 	try {
	// 		DbModel.Job.destroy({ where: { id } }).then(data => {
	// 			return data < 1 ? next(new AppError('data not found', 400, -1)) : true
	// 		});
	// 	} catch (err) {
	// 		return next(err.message)
	// 	}
	// }

	// async findOneWithFilter(next, filterArgs: GenericObject): Promise<Job> {
	// 	const state = await DbModel.Job.findOne({ where: filterArgs })
	// 	return state ? state : next(new AppError('no job data found with this credential', 400, -1))
	// }

	// whatToUpdate(data): GenericObject {
	// 	const newData = {}
	// 	for (let key in data) {
	// 		newData[key] = data[key]
	// 	}
	// 	return newData
	// }

	// async update(next, data: UpdateJob): Promise<Job> {
	// 	const dataToStore = this.whatToUpdate(data);
	// 	return DbModel.Job.update(dataToStore, { returning: true, where: { id: data.id } })
	// 		.then(async _ => {
	// 			return await this.getOne(next, (data.id as number));
	// 		})
	// 		.catch(e => console.log(e))
	// }
}

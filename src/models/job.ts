import { GenericObject, Job, NewJob, UpdateJob, JobByStatusFromStateOrTown } from './../misc/structs';
import { DbModel, AppError } from './../app/exported.classes';

import * as sequelize from 'sequelize'
const Op = sequelize.Op;

export class JobModel {
	constructor() { }

	jobRelations = [this.getUserWorkerRelation('user'), this.getUserWorkerRelation('worker')]

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

	async create(next, newJob: NewJob): Promise<Job> {
		const titleQueryCaseInsensitive = sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', `%${newJob.title}%`)
		const [job, created] = await DbModel.Job.findOrCreate({
			where: {
				[Op.and]: [
					{ worker_id: newJob.worker_id },		// ? Job for same worker
					{ user_id: newJob.user_id },			// ? Job from same user
					titleQueryCaseInsensitive,				// ? Same job title?
					{ start: null },						// ? It has not started?
					{ amount: null },						// ? No amount specified?
					{ status: 'pending' }					// ? It's even pending
				]											// ! My brother, don't bother creating another one, let them use this redundant one
			},
			defaults: newJob
		});
		if (created) return await this.getOne(next, job.id)
		return job
	}

	async getOne(next, id: number): Promise<Job> {
		return await DbModel.Job.findByPk(id, { include: this.jobRelations });
	}

	async getAll(): Promise<Job[]> {
		return await DbModel.Job.findAll({ include: this.jobRelations });
	}

	async getMore(query: { page: number, worker_id: number, user_id: number }): Promise<{ data: Job[], total: number, lastPage: boolean }> {
		return DbModel.Job.findAndCountAll({
			where: {
				[Op.and]: [
					{ worker_id: query.worker_id },
					{ user_id: query.user_id },
					{ status: { [Op.ne]: 'cancelled' } }
				]
			},
			order: [['updatedAt', 'DESC']],
			limit: 10,
			offset: 10 * query.page
		}).then(result => {
			const pageIncMonitor = (query.page + 2) * 10;
			const isLastPageNoMore = result.count >= pageIncMonitor ? false : true;
			return { data: result.rows, total: result.count, lastPage: isLastPageNoMore, more: !isLastPageNoMore }
		})
	}

	formatIntoQueryArray(arr: string[]) {
		return arr.map(str => {
			str = this.formatStringToFitRegExcape(str);
			const query = { [Op.regexp]: `.*${str}.*` }
			return query
		})
	}

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

	async jobsStatusWithTitleFrom(filter: JobByStatusFromStateOrTown) {
		const searchKeys = await this.convertTitle(filter.title);
		const filterArg = await this.formatIntoQueryArray(searchKeys)
		return DbModel.Job.findAndCountAll({
			where: {
				[Op.and]: [
					{ createdAt: { [Op.between]: [filter.start_range ? filter.start_range : 0, filter.end_range ? filter.end_range : Date.now()] } },
					{ title: { [Op.or]: filterArg } }
				]
			},
			include: {
				model: DbModel.Agent, as: 'worker', required: true, include: {
					model: DbModel.Location, as: 'location', required: true, where: { [`${filter.state_or_town}_id`]: filter.state_or_town_id }
				}
			},
			group: ['status']
		}).then(result => {
			const total = result.count.map(el => el.count).reduce((sum, num) => sum + num, 0)
			const regroup = result.count.map(el => ({ ...el, percent: (el.count / total) * 100 }))
			return { total, data: regroup }
		})
	}
	async jobsStatusFrom(filter: JobByStatusFromStateOrTown) {

		return DbModel.Job.findAndCountAll({
			where: {
				createdAt: { [Op.between]: [filter.start_range ? filter.start_range : 0, filter.end_range ? filter.end_range : Date.now()] },
			},
			include: {
				model: DbModel.Agent, as: 'worker', required: true, include: {
					model: DbModel.Location, as: 'location', required: true, where: { [`${filter.state_or_town}_id`]: filter.state_or_town_id }
				}
			},
			group: ['status']
		}).then(result => {
			const total = result.count.map(el => el.count).reduce((sum, num) => sum + num, 0)
			const regroup = result.count.map(el => ({ ...el, percent: (el.count / total) * 100 }))
			return { total, data: regroup }
		})
	}





	async delete(next, id: number): Promise<any> {
		try {
			DbModel.Job.destroy({ where: { id } }).then(data => {
				return data < 1 ? next(new AppError('data not found', 400, -1)) : true
			});
		} catch (err) {
			return next(err.message)
		}
	}

	async findOneWithFilter(next, filterArgs: GenericObject): Promise<Job> {
		const state = await DbModel.Job.findOne({ where: filterArgs })
		return state ? state : next(new AppError('no job data found with this credential', 400, -1))
	}

	whatToUpdate(data): GenericObject {
		const newData = {}
		for (let key in data) {
			newData[key] = data[key]
		}
		return newData
	}

	async update(next, data: UpdateJob): Promise<Job> {
		const dataToStore = this.whatToUpdate(data);
		return DbModel.Job.update(dataToStore, { returning: true, where: { id: data.id } })
			.then(async _ => {
				return await this.getOne(next, (data.id as number));
			})
			.catch(e => console.log(e))
	}
}

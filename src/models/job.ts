import { GenericObject, Job, NewJob, UpdateJob, JobByStatusFromStateOrTown } from './../misc/structs';
import { DbModel, AppError, formatIntoRegExQueryArray } from './../app/exported.classes';

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
		return DbModel.Job.findAndCountAll({ order: [['updatedAt', 'DESC']], limit: 20, include: this.jobRelations }).then( result => {
			const isLastPageNoMore = result.count >= 20 ? false : true;
			return { total: result.count, lastPage: isLastPageNoMore, more: !isLastPageNoMore, data: result.rows }
		});
	}
	async getAllMore(filter: {page: number, sort: 'descending' | 'ascending'}): Promise<{ data: Job[], total: number, lastPage: boolean }> {
		const sort = filter.sort ? filter.sort : 'desc';
		return DbModel.Job.findAndCountAll({
			order: [['updatedAt', sort]],
			limit: 20,
			offset: 20 * filter.page
		}).then(result => {
			const pageIncMonitor = (filter.page + 2) * 20;
			const isLastPageNoMore = result.count >= pageIncMonitor ? false : true;
			return { total: result.count, lastPage: isLastPageNoMore, more: !isLastPageNoMore, data: result.rows }
		})
	}

	// ? Load more jobs for a user
	async getMore(query: { page: number, worker_id: number, user_id: number }): Promise<{ data: Job[], total: number, lastPage: boolean }> {
		return DbModel.Job.findAndCountAll({
			where: {
				[Op.and]: [
					{ worker_id: query.worker_id },
					{ user_id: query.user_id },
					{ status: { [Op.ne]: 'cancelled' } }
				]
			},
			order: [['updatedAt', 'desc']],
			limit: 10,
			offset: 10 * query.page
		}).then(result => {
			const pageIncMonitor = (query.page + 2) * 10;
			const isLastPageNoMore = result.count >= pageIncMonitor ? false : true;
			return { data: result.rows, total: result.count, lastPage: isLastPageNoMore, more: !isLastPageNoMore }
		})
	}

	async jobsByTitleAndStatusFromStateOrTownForAdmin(filter: JobByStatusFromStateOrTown) {
		const result = await this.loadJobsByTitleAndStatusFromStateOrTown(filter);

		const total = result.count.map(el => el.count).reduce((sum, num) => sum + num, 0)

		const pageIncMonitor = ((filter.page as number) + 1) * 20;
		const isLastPageNoMore = total >= pageIncMonitor ? false : true;
		const regroup = result.count.map(el => ({ ...el, percent: (el.count / total) * 100 }))
		return { total, lastPage: isLastPageNoMore, more: !isLastPageNoMore, summary: regroup, data: result.rows, }
	}
	async jobsByTitleAndStatusFromStateOrTownForChart(filter: JobByStatusFromStateOrTown) {
		const result = await this.loadJobsByTitleAndStatusFromStateOrTown(filter);
		const total = result.count.map(el => el.count).reduce((sum, num) => sum + num, 0)
		const regroup = result.count.map(el => ({ ...el, percent: (el.count / total) * 100 }))
		return { total, data: regroup }
	}

	async loadJobsByTitleAndStatusFromStateOrTown(filter: JobByStatusFromStateOrTown) {
		const filterArg = formatIntoRegExQueryArray(filter.title)
		const sort = filter.sort ? filter.sort : 'desc';
		return DbModel.Job.findAndCountAll({
			where: {
				[Op.and]: [
					{ createdAt: { [Op.between]: [filter.start_range ? filter.start_range : 0, filter.end_range ? filter.end_range : Date.now()] } },
					{ title: { [Op.or]: filterArg } }
				] 
			},
			include: {
				model: DbModel.Agent, as: 'worker',
				required: filter.state_or_town == 'all' ? false : true,
				include: {
					model: DbModel.Location, as: 'location', required: true,
					where: { [filter.state_or_town == 'all' ? 'state_id' : `${filter.state_or_town}_id`]: filter.state_or_town == 'all' ? { [Op.gt]: 0 } : filter.state_or_town_id }
				}
			},
			order: [['updatedAt', sort]],
			limit: filter.page ? 20 : null,
			offset: filter.page ? 20 * (filter.page - 1) : null,
			group: [filter.grouped_by]
		})
	}
	jobsStatusByTitleFromStateOrTown
	async jobsBasedOnStatusFromStateOrTownForChart(filter: JobByStatusFromStateOrTown) {
		const result = await this.loadJobsBasedOnStatusFromStateOrTown(filter);
		const total = result.count.map(el => el.count).reduce((sum, num) => sum + num, 0)
		const regroup = result.count.map(el => ({ ...el, percent: (el.count / total) * 100 }))
		return { total, data: regroup }
	}

	async jobsBasedOnStatusFromStateOrTownForAdmin(filter: JobByStatusFromStateOrTown) {
		const result = await this.loadJobsBasedOnStatusFromStateOrTown(filter);

		const total = result.count.map(el => el.count).reduce((sum, num) => sum + num, 0)

		const pageIncMonitor = ((filter.page as number) + 1) * 20;
		const isLastPageNoMore = total >= pageIncMonitor ? false : true;
		const regroup = result.count.map(el => ({ ...el, percent: (el.count / total) * 100 }))
		return { total, lastPage: isLastPageNoMore, more: !isLastPageNoMore, summary: regroup, data: result.rows, }
	}
	
	loadJobsBasedOnStatusFromStateOrTown(filter: JobByStatusFromStateOrTown) {
		const sort = filter.sort ? filter.sort : 'desc';
		return DbModel.Job.findAndCountAll({
		where: {
				createdAt: { [Op.between]: [filter.start_range ? filter.start_range : 0, filter.end_range ? filter.end_range : Date.now()] },
			},
			include: {
				model: DbModel.Agent, as: 'worker',
				required: filter.state_or_town == 'all' ? false : true,
				include: {
					model: DbModel.Location, as: 'location', required: true,
					where: { [filter.state_or_town == 'all' ? 'state_id' : `${filter.state_or_town}_id`]: filter.state_or_town == 'all' ? { [Op.gt]: 0 } : filter.state_or_town_id }
				}
			},
			order: [['updatedAt', sort]],
			limit: filter.page ? 20 : null,
			offset: filter.page ? 20 * (filter.page - 1) : null,
			group: [filter.grouped_by]
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

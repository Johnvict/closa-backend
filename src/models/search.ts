import { GenericObject, NewSearchHistory, SearchHistory, SearchWorkerFromStateTown, SearchHistoryFromStateTown } from './../misc/structs';
import { DbModel, AppError, formatIntoRegExQueryArray } from './../app/exported.classes';

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
	}

	async getOne(next, id: number): Promise<SearchHistory> {
		return await DbModel.Job.findByPk(id);
	}

	async searchesWithKeyWord(filter: SearchHistoryFromStateTown, my_id) {
		const filterArg = await formatIntoRegExQueryArray(filter.key)
		return DbModel.SearchHistory.findAll({
			where: {
				key: { [Op.or]: filterArg }
			},
			attributes: ['key'],
		}).then(async result => {
			return result
		})
	}

	workerWithjobsTitle(filter: SearchWorkerFromStateTown, my_id) {
		const filterArg = formatIntoRegExQueryArray(filter.job)
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
					model: DbModel.Agent, as: 'agent', attributes: ['phone'], required: true, include: [
						{
							model: DbModel.Location, as: 'location', required: true,
							where: { [Op.and]: [{ [`${filter.state_or_town}_id`]: filter.state_or_town_id }, { id: { [Op.ne]: my_id } }] },
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
		}).then(result => {
			return result;
		});
	}

	async getAll(): Promise<SearchHistory[]> {
		return DbModel.SearchHistory.findAndCountAll({
			order: [['createdAt', 'desc']], limit: 20,
			attributes: ['key'],
			include: {
				model: DbModel.Agent, as: 'agent',
				attributes: ['username', 'email', 'phone', 'id', 'type', 'gender', 'dob']
			},
		})
			.then(result => {
				const isLastPageNoMore = result.count >= 20 ? false : true;
				return { total: result.count, lastPage: isLastPageNoMore, more: !isLastPageNoMore, data: result.rows }
			});
	}

	async getAllMore(filter: { page: number, sort: 'desc' | 'asc' }) {
		const sort = filter.sort ? filter.sort : 'desc';
		return DbModel.SearchHistory.findAndCountAll({
			order: [['createdAt', sort]], limit: 20,
			attributes: ['key'],
			offset: 20 * filter.page,
			include: {
				model: DbModel.Agent, as: 'agent',
				attributes: ['username', 'email', 'phone', 'id', 'type', 'gender', 'dob']
			},
		}).then(result => {
			const pageIncMonitor = (filter.page + 2) * 20;
			const isLastPageNoMore = result.count >= pageIncMonitor ? false : true;
			return { total: result.count, lastPage: isLastPageNoMore, more: !isLastPageNoMore, data: result.rows }
		})
	}


	async searchHistoryByKeyFromStateOrTownForAdmin(filter: SearchHistoryFromStateTown) {
		const result = await this.loadSearchHistoryFromStateOrTown(filter);

		const total = result.count.map(el => el.count).reduce((sum, num) => sum + num, 0)

		const pageIncMonitor = ((filter.page as number) + 1) * 20;
		const isLastPageNoMore = total >= pageIncMonitor ? false : true;
		const regroup = result.count.map(el => ({ ...el, percent: (el.count / total) * 100 }))
		return { total, lastPage: isLastPageNoMore, more: !isLastPageNoMore, summary: regroup, data: result.rows, }
	}
	async searchHistoryByKeyFromStateOrTownForChart(filter: SearchHistoryFromStateTown) {
		const result = await this.loadSearchHistoryFromStateOrTown(filter);
		const total = result.count.map(el => el.count).reduce((sum, num) => sum + num, 0)
		const regroup = result.count.map(el => ({ ...el, percent: (el.count / total) * 100 }))
		return { total, data: regroup }
	}

	async loadSearchHistoryFromStateOrTown(filter: SearchHistoryFromStateTown) {
		const filterArg = await formatIntoRegExQueryArray(filter.key)
		const sort = filter.sort ? filter.sort : 'desc';

		return DbModel.SearchHistory.findAndCountAll({
			where: {
				[Op.and]: [
					{ createdAt: { [Op.between]: [filter.start_range ? filter.start_range : 0, filter.end_range ? filter.end_range : Date.now()] } },
					{ key: { [Op.or]: filterArg } }
				]
			},
			include: {
				model: DbModel.Agent, as: 'agent',
				required: filter.state_or_town == 'all' ? false : true,
				attributes: ['username', 'email', 'phone', 'id', 'type', 'gender', 'dob'],
				include: {
					model: DbModel.Location, as: 'location',
					required: true,
					where: { [filter.state_or_town == 'all' ? 'state_id' : `${filter.state_or_town}_id`]: filter.state_or_town == 'all' ? { [Op.gt]: 0 } : filter.state_or_town_id }
				}
			},
			attributes: ['key', 'createdAt'],
			order: [['createdAt', sort]],
			limit: filter.page ? 20 : null,
			offset: filter.page ? 20 * (filter.page - 1) : null,
			group: ['createdAt']
		})
	}
}

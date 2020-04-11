import { AppError } from './../misc/app.error';
import { JobSample, NewJobSample, GenericObject, FileStruct, NewFileStruct } from "./../misc/structs"
import { DbModel } from './../app/exported.classes'

const Op = require('sequelize').Op;

export class JobSampleModel {
	constructor() { }

	jobSampleRelation = [
		{ model: DbModel.File, as: 'file' }
	];

	async create(next, newSample: NewJobSample): Promise<JobSample> {
		return DbModel.JobSample.findOrCreate({
			where: { [Op.and]: [{ worker_id: newSample.worker_id }, { title: newSample.title }] },
			defaults: { date_done: newSample.date_done, title: newSample.title, worker_id: newSample.worker_id }
		}).then(async (queryRes) => {
			if (queryRes[1]) {
				console.log(queryRes[1])
				await this.createFile({
					job_sample_id: queryRes[0].id,
					name: queryRes[0].title,
					url: newSample.link,
					type: newSample.type,
				});
				return await this.getOne(next, queryRes[0].id)
			}
			return next(new AppError('you already have a job sample with this title', 400, -1))
		}).catch(e => console.log(e));
	}
	
	async createFile(newFile: NewFileStruct): Promise<NewJobSample | boolean> {
		return DbModel.File.findOrCreate({
			where: { [Op.and]: [{ job_sample_id: newFile.job_sample_id }, { name: newFile.name }] },
			defaults: newFile
		}).catch(e => console.log(e));
	}
	async saveFileLink(next, whatToSave: {url: string, id: number, job_sample_id: number }): Promise<JobSample> {
		return DbModel.File.update({ url: whatToSave.url }, { returning: true, where: { id: whatToSave.id }})
		.then(async (queryRes) => {
			return queryRes ? await this.getOne(next, whatToSave.job_sample_id) : false
		}).catch(e => console.log(e));
	}

	async getOne(next, id: number): Promise<JobSample> {
		try {
			const data = await DbModel.JobSample.findByPk(id, { include: this.jobSampleRelation });
			return data ? data : next(new AppError('no job sample found with this credential', 500))
		} catch (err) {
			return next(err.message)
		}
	}
	async delete(next, id: number): Promise<any> {
		try {
			DbModel.JobSample.destroy({ where: { id } }).then(data => {
				return data < 1 ? next(new AppError('data not found', 400, -1)) : true
			});
		} catch (err) {
			return next(err.message)
		}
	}

	async findOneWithFilter(filterArgs: GenericObject): Promise<JobSample> {
		return await DbModel.JobSample.findOne({ where: filterArgs })
	}
}

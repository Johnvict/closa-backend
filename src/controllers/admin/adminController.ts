import { NewUpdateState, NewUpdateTown } from './../../misc/structs';
import { stateModel, townModel } from './../../app/exported.classes'

export class AdminController {

	async createManyStates(req, res, next) {
		const states: NewUpdateState[] = req.body;
		states.forEach(async state => {
			await stateModel.create(next, state)
		});
		return res.status(201).json({status: 1, data: await stateModel.getAll() });
	}
	async createManyTowns(req, res, next) {
		const towns: NewUpdateTown[] = req.body;
		towns.forEach(async town => {
			await townModel.create(next, town)
		});
		return res.status(201).json({status: 1, data: await townModel.getAll() });
	}

	async createState(req, res, next) {
		const state = await stateModel.create(next, req.body.state)
		return state ?
		res.status(201).json({status: 1, data: await state }) :
		res.status(201).json({status: -1, message: 'error creating state' })
	}
	async createTown(req, res, next) {
		const town = await townModel.create(next, req.body.town)
		return town ?
		res.status(201).json({status: 1, data: await town }) :
		res.status(201).json({status: -1, message: 'error creating town' })
	}


	async updateState(req, res, next) {
		return res.status(200).json({ status: 1, data: await stateModel.update(next, req.body) })
	}
	async updateTown(req, res, next) {
		return res.status(200).json({ status: 1, data: await townModel.update(next, req.body) })
	}

	async deleteState(req, res, next) {
		return res.status(200).json({ status: 1, data: await stateModel.delete(next, req.body) })
	}

	async deleteTown(req, res, next) {
		return res.status(200).json({ status: 1, data: await townModel.delete(next, req.body) })
	}

}

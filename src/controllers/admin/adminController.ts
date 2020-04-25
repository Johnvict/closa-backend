import { NewUpdateState, NewUpdateTown, LoginStruct } from './../../misc/structs';
import { stateModel, townModel, adminModel, agentModel, AppError, auth } from './../../app/exported.classes'
import { request } from 'http';

export class AdminController {


	async allAdmins(req, res, next) {
		if (this.isThisAdminAllowed(req, res, next, 'access')) {
			const admins = await adminModel.getAll()
			return res.status(200).json({
				status: 1,
				data: admins
			})
		}
	}

	async oneAdmin(req, res, next) {
		if (this.isThisAdminAllowed(req, res, next, 'access')) {
			const admin = await adminModel.findOneWithFilter(next, { id: req.params.id })
			return res.status(200).json({
				status: 1,
				data: admin
			})
		}
	}

	async create(req, res, next) {
		if (this.isThisAdminAllowed(req, res, next, 'create')) {
			const adminData = await adminModel.create(next, req.body);
			if (adminData) {
				return res.status(201).json({
					status: 1,
					data: adminData
				})
			}
		}
	}


	async update(req, res, next) {
		req.body.id = req.admin.id
		if (this.isThisAdminAllowed(req, res, next, 'update')) {
			adminModel.update(next, { ...req.body }).then(response => {
				if (response) return res.status(200).json({ status: 1, data: response })
			})
		}
	}
	async updateSuper(req, res, next) {
		if (this.isThisAdminAllowed(req, res, next, 'update')) {
			adminModel.update(next, { ...req.body }).then(response => {
				if (response) return res.status(200).json({ status: 1, data: response })
			})
		}
	}

	async delete(req, res, next) {
		if (this.isThisAdminAllowed(req, res, next, 'delete')) {
			adminModel.delete(next, req.body).then(data => {
				if (data) {
					return res.status(200).json({
						status: 1,
						data
					})
				}
			})
		}
	}

	async login(req, res, next) {
		const loginData = req.body;
		const adminData = await adminModel.findOneWithFilter(next, { username: loginData.username })
		if (!adminData) return res.status(401).json({ status: -1, message: 'invalid credentials' })
		if (adminData) {
			if (await auth.comparePassword(next, { candidatePassword: loginData.password, hashedPassword: adminData.password })) {
				res.status(200).json({
					status: 1,
					token: auth.generateToken(adminData.id, adminData.phone, adminData.type, 10),
					data: adminData
				})
				return this.upDateLoginTime(next, adminData.id);
			}
		}
	}

	upDateLoginTime(next, id) {
		adminModel.update(next, { lastLoginAt: new Date(Date.now()), id });
	}


	async changePassword(req: any, res, next) {
		let { old_password, new_password } = req.body;
		let adminData = await adminModel.findOneWithFilter(next, { id: req.admin.id })
		if (!adminData) return res.status(200).json({ status: -1, message: 'invalid credentials' })
		if (auth.comparePassword(next, { candidatePassword: old_password, hashedPassword: adminData.password }, true)) {
			adminModel.update(next, { password: new_password, id: adminData.id }).then(response => {
				console.log(response)
				if (response) return res.status(200).json({ status: 1, data: response });
			})
		}
	}

	isThisAdminAllowed(req, res, next, action: 'create' | 'update' | 'delete' | 'access') {
		const thisLogedInId = req.admin.id;
		if (action == 'create' || action == 'access') {
			if (req.admin.type !== 'super') {
				return next(new AppError(`Access denied, you are not allowed to ${action} this account`, 401, -1));
			}
		} else {
			if (req.body.id !== thisLogedInId && req.admin.type !== 'super') return next(new AppError(`Access denied, you are not allowed to ${action} this account`, 401, -1));
		}
		return true
	}

	async createManyStates(req, res, next) {
		const states: NewUpdateState[] = req.body;
		states.forEach(async state => {
			await stateModel.create(next, state)
		});
		return res.status(201).json({ status: 1, data: await stateModel.getAll() });
	}
	async createManyTowns(req, res, next) {
		const towns: NewUpdateTown[] = req.body;
		towns.forEach(async town => {
			await townModel.create(next, town)
		});
		return res.status(201).json({ status: 1, data: await townModel.getAll() });
	}

	async createState(req, res, next) {
		const state = await stateModel.create(next, req.body.state)
		return state ?
			res.status(201).json({ status: 1, data: await state }) :
			res.status(201).json({ status: -1, message: 'error creating state' })
	}
	async createTown(req, res, next) {
		const town = await townModel.create(next, req.body.town)
		return town ?
			res.status(201).json({ status: 1, data: await town }) :
			res.status(201).json({ status: -1, message: 'error creating town' })
	}


	async updateState(req, res, next) {
		stateModel.update(next, req.body).then(data => {
			if (data) {
				return res.status(200).json({ status: 1, data: data })
			}
		})
	}
	async updateTown(req, res, next) {
		townModel.update(next, req.body).then(data => {
			if (data) {
				return res.status(200).json({ status: 1, data })
			}
		})
	}

	async deleteState(req, res, next) {
		stateModel.delete(next, req.body).then(data => {
			if (data) {
				return res.status(200).json({ status: 1, data: data })
			}
		})
	}

	async deleteTown(req, res, next) {
		townModel.delete(next, req.body).then(data => {
			if (data) {
				return res.status(200).json({ status: 1, data: data })
			}
		})
	}

}

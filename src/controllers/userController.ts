import { auth, userModel } from './../app/exported.classes'

export class UserController {

	// For a super admin who wants to see all registered user
	allUsers(req, res) {
		userModel.getAll().then(response => {
			return response.error ? res.status(400).json({
				status: -1,
				message: response.error
			}) : res.status(200).json({
				status: 1,
				data: response.data
			})
		})
	}
	// async getOne(id) {
	// 	return await userModel.findOneWithFilter({ id: { $eq: id } })
	// }
	// async checkPhone(phone) {
	// 	return await userModel.findOneWithFilter({ phone: { $eq: phone } })
	// }
	// async checkEmail(email) {
	// 	return await userModel.findOneWithFilter({ email: { $eq: email } })
	// }

	async createUser(req, res) {
		userModel.create(req.body).then(response => {
			return response.error ? 
				res.status(400).json({ status: -1, message: response.error }) : 
				res.status(201).json({ status: 1, data: response.data });
		})
	}

	async updateUser(req, res) {
		userModel.update({ id: req.user.id, ...req.body }).then(response => {
			return response.error ? 
			res.status(400).json(response.error) : 
			res.status(200).json({ status: 1, data: response.data })
		})
	}

	// We don't want to delete the user account, but change it to { active: false }
	deleteUser(req, res) {
		const user = req.user
		userModel.update({ active: false, id: req.user.id }).then(response => {
			return response.error ? res.status(401).json({ status: -1, message: response.error }) : res.status(200).json({ status: 1, data: response.data });
		})
	}

	async login(req, res) {
		const { phone, password } = req.body;
		const user = await userModel.findOneWithFilter({ phone: phone })
		if (!user) return res.status(401).json({ status: -1, message: 'invalid credentials' });
		if (!auth.comparePassword({ candidatePassword: password, hashedPassword: user.password })) return res.status(401).json({ status: '-1', message: 'invalid credentials' });
		res.json({
			status: 1,
			token: auth.generateToken(user.id, user.phone, user.type),
			data: user
		});
		return this.upDateLoginTime(user.id);
	}

	upDateLoginTime(id) {
		userModel.update({ active: true, lastLoginAt: Date.now(), id });
	}

	async changePassword(req: any, res) {
		let { old_password, new_password} = req.body;
		let user = await userModel.findOneWithFilter({id: req.user.id })
		const isOldPasswordValid = auth.comparePassword({candidatePassword: old_password, hashedPassword: user.password});
		if (!isOldPasswordValid) return res.status(401).json({ status: -1, message: 'old password is invalid' });
		// new_password = await auth.hashPassword(new_password);

		userModel.update({password: new_password, id: user.id}).then( response => {
			return response.error ? res.status(401).json({ status: -1, message: response.error }) : res.status(201).json({ status: 1, data: user });
		})
	}
}

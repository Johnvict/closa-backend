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
	async getOne(id) {
		return await userModel.findOneWithFilter({ _id: { $eq: id } })
	}
	async checkPhone(phone) {
		return await userModel.findOneWithFilter({ phone: { $eq: phone } })
	}
	async checkEmail(email) {
		return await userModel.findOneWithFilter({ email: { $eq: email } })
	}

	async createUser(req, res) {
		const isEmailTaken = await this.checkEmail(req.body.email)
		if (isEmailTaken) return res.status(400).json([{ email: 'this email is already taken' }])
		const isPhoneTaken = await this.checkPhone(req.body.phone)
		if (isPhoneTaken) return res.status(400).json([{ phone: 'this phone number is already taken' }])
		userModel.create(req.body).then(response => {
			return response.error ? res.status(400).json(response.error) : res.status(201).json({ status: 1, data: response.data });
		})
	}

	async updateUser(req, res) {
		userModel.update({ _id: req.user._id, ...req.body }).then(response => {
			return response.error ? res.status(400).json(response.error) : res.status(200).json({
				status: 1,
				data: response.data
			});
		})
	}

	// We don't want to delete the user account, but change it to { active: false }
	deleteUser(req, res) {
		const user = req.user
		userModel.update({ active: false, _id: req.user._id }).then(response => {
			return response.error ? res.status(401).json({ status: -1, message: response.error }) : res.status(201).json({ status: 1, data: user._id });
		})
	}
	async changePassword(req: any, res) {
		const { old_password, new_password } = req.body;
		let user = req.user
		user = await userModel.findOneWithFilter({ email: { $eq: user.email } })
		const isPasswordValid = auth.comparePassword({ candidatePassword: old_password, hashedPassword: user.password });
		if (!isPasswordValid) return res.status(401).json({ status: -1, message: 'old password is invalid' });
		user.password = auth.hashPassword(new_password);
		userModel.update({ password: user.password, _id: user._id }).then(response => {
			return response.error ? res.status(401).json({ status: -1, message: response.error }) : res.status(201).json({ status: 1, data: user });
		})
	}
	async login(req, res) {
		const { email, password } = req.body;
		const user = await userModel.findOneWithFilter({ email: { $eq: email } })
		if (!user) return res.status(401).json({ status: -1, message: 'invalid credentials' });
		if (!auth.comparePassword({ candidatePassword: password, hashedPassword: user.password })) return res.status(401).json({ status: '-1', message: 'invalid credentials' });
		res.json({
			status: 1,
			token: auth.generateToken(user._id, user.email, user.username),
			data: user
		});
		return this.upDateLoginTime(user._id);
	}

	upDateLoginTime(_id) {
		userModel.update({ active: true, lastLoginAt: Date.now(), _id });
	}
}

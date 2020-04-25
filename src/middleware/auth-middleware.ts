import { DbModel, tokenModel } from './../app/exported.classes';
let JWT = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

export const agentMiddleware = (req: any, res: any, next: any) => {
	const token = req.header('authorization')
	if (!token) return res.status(401).json({ message: 'Access denied. Authorization Token not provided.', status: -1})
	try {
		const tokenDecoded = JWT.verify(token, jwtSecret)
		if (tokenDecoded.type === 'user' || tokenDecoded.type === 'worker') {
			req.agent = tokenDecoded
			next()
		} else {
			return res.status(401).json({ message: 'Access denied. You cannot access this endpoint', status: -1})
		}
	} catch(err) {
		return res.status(401).json({ message: 'Invalid token.', status: -1})
	}
}

export const newAgentMiddleware = async (req, res, next) => {
	const { agent_id, token } = req.body;
	const isTokenValid = await tokenModel.validateToken({ agent_id, token })
	req.agent = { id: agent_id, token }
	if (isTokenValid) return next()
	return res.status(401).json({ message: 'Invalid token provided.', status: -1})
}

export const userMiddleware = (req: any, res: any, next: any) => {
	const token = req.header('authorization')
	if (!token) return res.status(401).json({ message: 'Access denied. Authorization Token not provided.', status: -1})
	try {
		const tokenDecoded = JWT.verify(token, jwtSecret)
		if (tokenDecoded.type === 'user') {
			req.agent = tokenDecoded
			next()
		} else {
			return res.status(401).json({ message: 'Access denied. You cannot access this endpoint', status: -1})
		}
	} catch(err) {
		return res.status(401).json({ message: 'Invalid token.', status: -1})
	}
}

export const workerMiddleware = (req: any, res: any, next: any) => {
	const token = req.header('authorization')
	if (!token) return res.status(401).json({ message: 'Access denied. Authorization Token not provided.', status: -1})
	try {
		const tokenDecoded = JWT.verify(token, jwtSecret)
		if (tokenDecoded.type === 'worker') {
			req.agent = tokenDecoded
			next()
		} else {
			return res.status(401).json({ message: 'Access denied. You cannot access this endpoint', status: -1})
		}
	} catch(err) {
		return res.status(401).json({ message: 'Invalid token.', status: -1})
	}
}

export const adminMiddleware = (req: any, res: any, next: any) => {
	const token = req.header('authorization')
	if (!token) return res.status(401).json({ message: 'Access denied. Authorization Token not provided.', status: -1})
	try {
		const tokenDecoded = JWT.verify(token, jwtSecret)
		if (tokenDecoded.type === 'admin' || tokenDecoded.type === 'super') {
			req.admin = tokenDecoded
			next()
		} else {
			return res.status(401).json({ message: 'Access denied. You cannot access this endpoint', status: -1})
		}
	} catch(err) {
		return res.status(401).json({ message: 'Invalid token.', status: -1})
	}
}
export const superAdminMiddleware = (req: any, res: any, next: any) => {
	const token = req.header('authorization')
	if (!token) return res.status(401).json({ message: 'Access denied. Authorization Token not provided.', status: -1})
	try {
		const tokenDecoded = JWT.verify(token, jwtSecret)
		if (tokenDecoded.type === 'super') {
			req.admin = tokenDecoded
			next()
		} else {
			return res.status(401).json({ message: 'Access denied. You cannot access this endpoint', status: -1})
		}
	} catch(err) {
		return res.status(401).json({ message: 'Invalid token.', status: -1})
	}
}

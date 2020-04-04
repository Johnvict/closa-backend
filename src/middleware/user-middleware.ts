let JWT = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

export const userMiddleware = (req: any, res: any, next: any) => {
	const token = req.header('authorization')
	if (!token) return res.status(401).send('Access denied. Authorization Token not provided.')
	try {
		const tokenDecoded = JWT.verify(token, jwtSecret)
		req.user = tokenDecoded
		next()
	} catch(err) {
		return res.status(401).send('Invalid token.')
	}
}

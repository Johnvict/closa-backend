let JWT = require('jsonwebtoken');
// const config = require('config')
// const jwtSecret = config.get('jwtPrivateKey') //process.env.JWT_SECRET
const jwtSecret = "live-chat-is-kjdfhkdjdghvbvjled-edfljdbcdjcd-erqewff355-fwe" //process.env.JWT_SECRET;
export const adminMiddleware = (req: any, res: any, next: any) => {
	const token = req.header('authorization')
	if (!token) return res.status(401).send('Access denied. Authorization Token not provided.')
	try {
		const tokenDecoded = JWT.verify(token, jwtSecret)
		if(tokenDecoded.role != 'admin')  return res.status(401).send('Unauthorized. You are not allowed to access this resource.')
		req.user = tokenDecoded
		next()
	} catch(err) {
		return res.status(400).send('Invalid token.')
	}
}

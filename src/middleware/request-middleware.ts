export const validateRequest = (req: any, res: any, next: any) => {
	if (!req.body) return res.status(400).send('Invalid request. Please send appropriate data in the request body')
	next()
}

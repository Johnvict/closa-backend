import { AppError } from "../app/exported.classes";

// module.exports = (fn): any => {
// 	return (req, res, next) => {
// 		// fn().catch(next);
// 		fn(req, res, next).catch(next);
// 	}
// }


module.exports = (fn): any => {
	return (req, res, next) => {
		return fn().catch(err => {
			console.log(`\n\n\n`, err.message, `\n\n\n`)
			// next(new AppError(err.message, 400))
			next()
		});
	}
}

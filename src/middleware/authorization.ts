import { AppError } from './../app/exported.classes';
import { PasswordAuthValidation } from "../misc/structs";
const  bcrypt =  require('bcrypt');
const salt = bcrypt.genSaltSync(10)
const  jwt = require('jsonwebtoken');
let ExtractJwt = require('passport-jwt').ExtractJwt;


export class Authorization {	
	jwtSecret = process.env.JWT_SECRET;


	comparePassword(next, data: PasswordAuthValidation, isChangePassword?){
		if (bcrypt.compareSync(data.candidatePassword, data.hashedPassword)) {
			return true
		}
		const statusCode =  isChangePassword ? 200 : 401
		const statusMessage =  isChangePassword ? 'old password is invalid' : 'invalid credential'
		next(new AppError( statusMessage , statusCode, -1))
	}
	
	hashPassword(password: string) {
		return bcrypt.hashSync(password, salt);
	}

	generateToken(id: number, phone: string, type: string, otherid: number) {
		return jwt.sign({id, phone, type, otherid}, this.jwtSecret, {
			expiresIn: 86400		// Any issued token EXPIRES IN 1 day
		}); 
	}

	decodeToken() {
		return (req: any, res: any, next: any) => {
			const token = req.header('authorization')
			if (!token) return res.status(401).send('Access denied. Authorization Token not provided.')
			console.log(token);
			try {
				const tokenDecoded = jwt.verify(token, this.jwtSecret)
				req.agent = tokenDecoded
				next()
			} catch(err) {
				return res.status(400).send('Invalid token')
			}
		}
	}

}

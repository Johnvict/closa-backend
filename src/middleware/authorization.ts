import { PasswordAuthValidation, UserStruct } from "../misc/structs";
const  bcrypt =  require('bcrypt');
const salt = bcrypt.genSaltSync(10)
const  jwt = require('jsonwebtoken');
// let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
// const config = require('config');


export class Authorization {	
	jwtSecret = process.env.JWT_SECRET;
	// jwtSecret = "live-chat-is-kjdfhkdjdghvbvjled-edfljdbcdjcd-erqewff355-fwe" //process.env.JWT_SECRET;

	comparePassword(data: PasswordAuthValidation): boolean {
		return bcrypt.compareSync(data.candidatePassword, data.hashedPassword);
	}
	
	hashPassword(password: string) {
		return bcrypt.hashSync(password, salt);
	}

	generateToken(_id: number | string, email: string, username: string) {
		return jwt.sign({_id, email, username}, this.jwtSecret, {
			expiresIn: 86400		// Any issued token EXPIRES IN 1 day
		});
	}

	decodeToken() {
		return (req: any, res: any, next: any) => {
			const token = req.header('authorization')
			if (!token) return res.status(401).send('Access denied. Authorization Token not provided.')
			try {
				const tokenDecoded = jwt.verify(token, this.jwtSecret)
				req.user = tokenDecoded
				next()
			} catch(err) {
				return res.status(400).send('Invalid token.')
			}
		}
	}

	decodePureToken(sentToken: string): {error?: string, data?: UserStruct} {
		try {
			const user = jwt.verify(sentToken, this.jwtSecret)
			console.log(user)
			return { data: user }
		} catch(err) {
			console.log('ERROR-DECODING-TOKEN', err)
			return {error: 'invalid token'}
		}
	}

}

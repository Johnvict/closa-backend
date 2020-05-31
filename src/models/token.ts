import { GenericObject, NewToken, Token } from './../misc/structs';
import { DbModel, AppError } from './../app/exported.classes'
// const Op = require('sequelize').Op;

import { Op, Sequelize } from 'sequelize';  
import sequelize from 'sequelize';

export class TokenModel {
	constructor() { }

	async create(next, newToken: NewToken): Promise<Token> {
		return DbModel.Token.findOrCreate({
			where: { [Op.or]: [{ agent_id: newToken.agent_id }] },
			defaults: newToken
		}).then(async (queryRes) => {
			if (!queryRes[1]) {
				this.update(newToken)
			}
			// ! ! ! Send the token to the phone number as text message
			// ! ! ! Send the token to the phone number as text message
			// ! ! ! Send the token to the phone number as text message
		}).catch(e => console.log(e));
	}

	async validateToken(receivedToken): Promise<boolean> {
		const token = await DbModel.Token.findOne({where: {agent_id: receivedToken.agent_id }});
		if (token) {
			console.table({...token, trueOrFalse: ((token.token == receivedToken.token) && (new Date(token.expireAt).getTime() >= Date.now()))})
			return (token.token == receivedToken.token) && (new Date(token.expireAt).getTime() >= Date.now()) ? true : false;
		}
		return false;
	}

	async delete(id: number): Promise<any> {
		try {
			DbModel.Token.destroy({ where: { agent_id: id } })
		} catch (err) {
			console.log(err);
		}
	}
	
	async update(token: NewToken): Promise<Token> {
		return DbModel.Token.update(token, { where: { agent_id: token.agent_id } })
			.then(async _ => { })
			.catch(e => console.log(e))
	}
}

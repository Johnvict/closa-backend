import { GenericObject, Location, NewLocation, UpdateLocation, Town } from './../misc/structs';
import { DbModel, AppError, townModel } from './../app/exported.classes'

const Op = require('sequelize').Op;

export class LocationModel {
	constructor() { }

	async create(next, newLocation: NewLocation): Promise<Location> {
		// We sahll first confirm if the town exists already
		// if (!newLocation.town_id) {
		// 	const newTown: Town = await townModel.create(next, {name: newLocation.town_name, state_id: newLocation.state_id});
		// 	newLocation.town_id = newTown.id;
		// }

		// const dataToStore = { 
		// 	agent_id: newLocation.agent_id,
		// 	lat: newLocation.lat,
		// 	long: newLocation.long,
		// 	name: newLocation.name,
		// 	image: newLocation.image,
		// 	state_id: newLocation.state_id,
		// 	town_id: newLocation.town_id
		//   }
		return DbModel.Location.findOrCreate({
			where: { [Op.or]: [{ agent_id: newLocation.agent_id }] },
			defaults: newLocation
		}).then(async (queryRes) => {
			if (queryRes[1]) return await this.getOne(next, queryRes[0].id)
			return next(new AppError('user location already created', 400, -1))
		}).catch(e => console.log(e));
	}

	async getOne(next, id: number): Promise<Location> {
		return await DbModel.Location.findByPk(id);
	}

	async findOneWithFilter(next, filterArgs: GenericObject): Promise<Location> {
		const location = await DbModel.Location.findOne({ where: filterArgs })
		// console.log('40: LOCATION FOUND', location)
		return location ? location : next(new AppError('no location data found with this credential', 400, -1)) 
	}

	whatToUpdate(data): GenericObject {
		const newData = {}
		for (let key in data) {
			newData[key] = data[key]
		}
		return newData
	}

	async update(next, data: UpdateLocation): Promise<Location> {
		const dataToStore = this.whatToUpdate(data);
		return DbModel.Location.update(dataToStore, { returning: true, where: { agent_id: data.agent_id } })
			.then(async _ => {
				return await this.findOneWithFilter(next, {agent_id: data.agent_id});
			})
			.catch(e => console.log(e))
	}
}

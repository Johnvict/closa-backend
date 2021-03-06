import { searchModel, AppError, apiCaller, distanceCalculator } from './../app/exported.classes'
import { RequestOption } from '../misc/structs';

export class SearchController {

	async create(req, res, next) {
		const data = await searchModel.create(next,{ ...req.body, agent_id: req.agent.id })
		console.log(data)
		// if (data) return res.status(201).json({status: 1, data });
	}
	
	async search(req, res, next) {
		const data = await searchModel.workerWithjobsTitle(req.body, req.agent.id)
		if (data) return res.status(201).json({status: 1, data });
	}

	async allSearches(req, res, next) {
		const searches = await searchModel.getAll();
		return res.status(201).json({status: 1, ...searches });
	}

	async allSearchesMore(req, res, next) {
		const searches = await searchModel.getAllMore(req.body);
		if (searches) return res.status(201).json({status: 1, ...searches });
	}
	
	async searchesForChart(req, res, next) {
		const data =await searchModel.searchHistoryByKeyFromStateOrTownForChart(req.body);
		if (data) return res.status(201).json({status: 1, ...data });
	}
	async searchesForAdmin(req, res, next) {
		const data =await searchModel.searchHistoryByKeyFromStateOrTownForAdmin(req.body);
		if (data) return res.status(201).json({status: 1, ...data });
	}

	async searchToArrange(req, res, next) {
		const request: RequestOption = {
			method: 'POST',
			url: 'search/available-worker',
			body: req.body,
			token: req.header('authorization'),
		}
		const response = await apiCaller(request)
		if (response.error) return res.json(response.error)
		res.status(200).send({
			status: response.data.status,
			data: await this.sortComputeRating(response.data.data, req.body.my_lat, req.body.my_long)
		})

		return searchModel.create(next, { agent_id: req.agent.id, key: req.body.job})
	}

	sortComputeRating(data, my_lat, my_long) {
		const newObjArray: any[] = [];
		data.forEach( dataObj => {
			const newObj = dataObj
			for (let key in dataObj.agent)  {
				if (key === "location") {
					newObj['location'] = {
						...dataObj.agent.location,
						state: dataObj.agent.location.state.name,
						town: dataObj.agent.location.town.name,
						distance: distanceCalculator(dataObj.agent.location.lat, dataObj.agent.location.long, my_lat, my_long, 'K')
					}
				} else if (key === "worker_jobs") {
					const total_rating_points = dataObj.agent.worker_jobs.reduce((sum, val) => (val.rating + sum), 0)
					const total_rating_available = dataObj.agent.worker_jobs.filter(val => val.rating > 0).length
					const total_obtainable_rating = total_rating_available * 5
					const average_raiting_obtained = total_obtainable_rating == 0 ? 0 :	 (total_rating_points/total_obtainable_rating) * 5
					newObj['rating'] = { total: total_rating_available, average: Number(average_raiting_obtained.toFixed(2)) }
				} else {
					newObj[key] = dataObj.agent[key]
				}
			}
			delete newObj['agent']
			newObjArray.push(newObj);
		})
		return this.sortByDistance(newObjArray);
	}

	sortByDistance(arr: any[]) {
		return arr.sort((a, b) => a.location.distance > b.location.distance ? 1 : -1);
	}

	// async update(req, res, next) {
	// 	// console.log('48: REQUEST IMAGE', req.body)
	// 	const data = await searchModel.update(next, {...req.body, agent_id: req.agent.id})
	// 	if (data) return res.status(200).json({ status: 1, data })
	// }
}

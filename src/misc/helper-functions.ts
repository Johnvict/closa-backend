import { Op } from 'sequelize'

export class HelperFunctions {

	/**
	 * 
	 * @param lat1 @type number | The first location latitude
	 * @param lon1 @type number | The first location latitude
	 * @param lat2 @type number | The second location latitude
	 * @param lon2 @type number |The second location longitude
	 * @param unit @type <M | N | K> Unit of distance convertion
	 * 
	 */
	convertToDistance(lat1: number, lon1: number, lat2: number, lon2: number, unit: 'M' | 'N' | 'K') {
		if ((lat1 == lat2) && (lon1 == lon2)) {
			return 0;
		}
		else {
			let radlat1 = Math.PI * lat1 / 180;
			let radlat2 = Math.PI * lat2 / 180;
			let theta = lon1 - lon2;
			let radtheta = Math.PI * theta / 180;
			let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			if (dist > 1) {
				dist = 1;
			}
			dist = Math.acos(dist);
			dist = dist * 180 / Math.PI;
			dist = dist * 60 * 1.1515;
			if (unit == "K") { dist = dist * 1.609344 }
			if (unit == "N") { dist = dist * 0.8684 }
			return dist.toFixed(2)
			// return dist;
		}
	}
	
	formatIntoRegExQueryArray(theStr) {
		let text = theStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		text = text.replace(/\b(?:and|or|with|on|of|for|under|across|&|in|an|-)\b/ig, '')
		text = text.replace("    ", " ")
		text = text.replace("   ", " ")
		text = text.replace("  ", " ")
		text = text.replace("  ", " ")
	
	
		let arr = text.split(' ')
		arr.forEach(el => {
			const indexOfNull = arr.indexOf("")
			if (indexOfNull >= 0) arr.splice(indexOfNull, 1)
		})
		// return this.formatIntoQueryArray(arr)
		return arr.map(str => {
			const query = { [Op.regexp]: `.*${str}.*` }
			return query
		})
	}
	
	formatIntoQueryArray(arr: string[]) {
		return arr.map(str => {
			const query = { [Op.regexp]: `.*${str}.*` }
			return query
		})
	}
}



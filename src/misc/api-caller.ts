const url = 'http://localhost:3030/api'
const fetch = require('node-fetch');

import { RequestOption } from "./structs"

export async function makeAPICall(requestOption: RequestOption): Promise<{error?: any, data?: any}> {

	const options = await  {
		method: requestOption.method,
		headers: {
			'Accept': 'application/json',
			'Content-type': 'application/json'
		}
	}
	if (requestOption.token) options.headers['Authorization'] = requestOption.token
	if (requestOption.body) options['body'] = JSON.stringify(requestOption.body)

	return await fetch(`${url}/${requestOption.url}`, options)
	.then( resp => resp.json())
	.then( res => {
		console.log(res)
		return res.status === -1 ?  {error: res} : { data: res}
	}, err => {
		console.log('ERROR FETCHING REQUEST: ', err)
		return err
	})
}
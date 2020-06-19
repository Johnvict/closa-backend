// const winston = require('winston')
import * as winston from 'winston';
import * as cron from 'node-cron';
import { DateFormatted } from './structs';

// winston.add(winston.transports.File);

const dayDifference = new Date().getDay()

const getDate = function (): DateFormatted {
	const date = new Date();
	return {
		day: date.getDate(),
		month: date.getMonth() + 1,
		year: date.getFullYear()
	}
}

const createFolderName = function () {
	const dateObj = getDate()
	return new Date(`${dateObj.year} ${dateObj.month} ${dateObj.day - dayDifference }`).toDateString() + ' - ' + new Date(`${dateObj.year} ${dateObj.month} ${dateObj.day + 6}`).toDateString()
}

const createFileName = function() {
	return `${new Date().toDateString()}.log`
}


cron.schedule("0 0 * * 0", () => { // @weekly, 12:00 on Sunday
	const date = getDate()
	folderName = createFolderName()
	console.log('NEW FOLDER NAME:', folderName)
})

cron.schedule("0 0 * * *", () => { // @daily, 12:00 daily
	fileName = createFileName() 
	console.log('NEW FILE NAME:', fileName)
})

let folderName = createFolderName(), fileName = createFileName()
console.log('NEW FOLDER NAME:', folderName)
console.log('NEW FILE NAME:', fileName)


const logger = winston.createLogger({
	transports: [new winston.transports.File({
		filename: `logs/${folderName}/${fileName}`
	})],
	format: winston.format.json(),
})



module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	console.log(`\n\n\n APP ERROR GOT THIS\n\n\n`)
	
	const time = new Date().toLocaleTimeString()
	console.log(typeof err.statusCode, err.statusCode)
	err.statusCode < 500 ? logger.info(`${time}: ${err.message}`) : logger.push(logger.error(`${time}: ${err.message}`))

	return res.status(err.statusCode).send({
		status: err.status,
		message: err.message
	})
}


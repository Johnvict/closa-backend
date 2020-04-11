export class AppError extends Error {
	statusCode: number;
	status: any;
	isOperational: boolean;
	constructor(message: string, statusCode: number, statusInbody?) {
		super(message)
		this.statusCode = statusCode;
		this.status = statusInbody? statusInbody : `${statusCode}`.startsWith('4') ?  'fail' : 'error';

		this.isOperational = true;		
		Error.captureStackTrace(this, this.constructor);
		console.log('ERROR STACKTRACE:', Error)
		return
	}
}

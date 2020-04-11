"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode, statusInbody) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusInbody ? statusInbody : `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
        console.log('ERROR STACKTRACE:', Error);
        return;
    }
}
exports.AppError = AppError;

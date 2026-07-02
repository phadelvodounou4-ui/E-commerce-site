const logger = require('../utils/logger');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleDBError = (err) => {
  if (err.name === 'SequelizeUniqueConstraintError') return new AppError(`Duplicate value.`, 400);
  if (err.name === 'SequelizeValidationError') return new AppError(`Invalid input: ${err.errors.map(e => e.message).join(', ')}`, 400);
  if (err.name === 'SequelizeForeignKeyConstraintError') return new AppError('Referenced record not found.', 400);
  return err;
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({ status: err.status, error: err, message: err.message, stack: err.stack });
  }
  let error = { ...err, message: err.message };
  if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') error = handleDBError(error);
  if (error.name === 'JsonWebTokenError') error = new AppError('Invalid token', 401);
  if (error.name === 'TokenExpiredError') error = new AppError('Token expired', 401);
  if (error.isOperational) return res.status(error.statusCode).json({ status: error.status, message: error.message });
  logger.error('UNEXPECTED ERROR:', error);
  return res.status(500).json({ status: 'error', message: 'Something went wrong.' });
};

errorHandler.AppError = AppError;
module.exports = errorHandler;

const { logger } = require("firebase-functions");

class AppError extends Error {
  constructor(statusCode, message, error = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    logger.error(error);

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error('Error:', err);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = { AppError, errorHandler };

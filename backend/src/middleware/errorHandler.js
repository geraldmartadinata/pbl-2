const env = require('../config/env');
const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let { statusCode, message, code, errors } = err;

  // fallback for non-apierror instances
  if (!(err instanceof ApiError)) {
    statusCode = statusCode || 500;
    message = message || 'Internal Server Error';
    code = 'INTERNAL_SERVER_ERROR';

    // handle pg unique constraint error
    if (err.code === '23505') {
      statusCode = 409;
      message = 'Resource already exists.';
      code = 'RESOURCE_ALREADY_EXISTS';
    }
  }

  res.locals.errorMessage = err.message;

  const response = {
    success: false,
    message,
    code,
    ...(errors && errors.length > 0 && { errors }),
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (env.NODE_ENV !== 'test') {
    console.error(`[Error] ${statusCode} - ${message}`, err);
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;

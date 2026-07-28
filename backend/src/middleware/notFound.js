const ApiError = require('../utils/ApiError');

const notFound = (req, res, next) => {
  next(new ApiError(404, `Not Found - ${req.originalUrl}`, 'RESOURCE_NOT_FOUND'));
};

module.exports = notFound;

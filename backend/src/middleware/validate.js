const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  try {
    const validData = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // apply validated data to request
    req.body = validData.body;
    req.query = validData.query;
    req.params = validData.params;
    
    next();
  } catch (error) {
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    
    next(new ApiError(400, 'Validation failed.', 'VALIDATION_ERROR', formattedErrors));
  }
};

module.exports = validate;

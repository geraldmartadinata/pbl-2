const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // limit 10 login requests per window
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit 5 register requests per window
  message: {
    success: false,
    message: 'Too many registration attempts, please try again after an hour',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

module.exports = {
  loginLimiter,
  registerLimiter
};

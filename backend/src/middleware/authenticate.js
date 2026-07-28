const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { pool } = require('../config/database');

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized to access this route', 'UNAUTHORIZED'));
  }

  try {
    const decoded = verifyToken(token);
    
    // check if user exists and is active
    const { rows } = await pool.query(
      'SELECT id, role, is_active FROM users WHERE id = $1',
      [decoded.id]
    );

    const user = rows[0];

    if (!user) {
      return next(new ApiError(401, 'User associated with this token no longer exists.', 'UNAUTHORIZED'));
    }

    if (!user.is_active) {
      return next(new ApiError(401, 'User account is inactive.', 'UNAUTHORIZED'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Not authorized to access this route', 'UNAUTHORIZED'));
  }
});

module.exports = authenticate;

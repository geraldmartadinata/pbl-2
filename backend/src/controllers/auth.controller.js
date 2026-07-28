const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

class AuthController {
  register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        userId: user.id,
        role: user.role
      }
    });
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { token } = await authService.login(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: { token }
    });
  });

  getMe = asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.user.id);
    
    // remove password hash
    delete user.password_hash;
    
    res.status(200).json({
      success: true,
      message: 'Current user profile retrieved successfully.',
      data: user
    });
  });
}

module.exports = new AuthController();

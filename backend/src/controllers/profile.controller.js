const profileService = require('../services/profile.service');
const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

class ProfileController {
  getMe = asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.user.id);
    
    // remove password hash
    delete user.password_hash;
    
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully.',
      data: user
    });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const updatedUser = await profileService.updateProfile(req.user.id, req.body);
    
    delete updatedUser.password_hash;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: updatedUser
    });
  });
}

module.exports = new ProfileController();

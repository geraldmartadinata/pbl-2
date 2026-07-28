const userRepository = require('../repositories/user.repository');

class ProfileService {
  async updateProfile(userId, updateData) {
    const updatedUser = await userRepository.updateProfile(userId, updateData);
    return updatedUser;
  }
}

module.exports = new ProfileService();

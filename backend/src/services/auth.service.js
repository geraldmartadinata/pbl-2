const userRepository = require('../repositories/user.repository');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

class AuthService {
  async register(data) {
    const { email, nim, password } = data;

    // check if email exists
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      throw new ApiError(409, 'Email is already registered.', 'EMAIL_ALREADY_REGISTERED', [
        { field: 'email', message: 'Email is already registered.' }
      ]);
    }

    // check if nim exists
    const existingNim = await userRepository.findByNim(nim);
    if (existingNim) {
      throw new ApiError(409, 'NIM is already registered.', 'NIM_ALREADY_REGISTERED', [
        { field: 'nim', message: 'NIM is already registered.' }
      ]);
    }

    // hash password
    const passwordHash = await hashPassword(password);

    // create user
    const newUser = await userRepository.create({
      ...data,
      passwordHash,
      role: 'APPLICANT' // set default role
    });

    return newUser;
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
    }

    if (!user.is_active) {
      throw new ApiError(403, 'User account is inactive.', 'FORBIDDEN');
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
    }

    const token = generateToken(user.id, user.role);

    return { token };
  }

  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found.', 'RESOURCE_NOT_FOUND');
    }
    return user;
  }
}

module.exports = new AuthService();

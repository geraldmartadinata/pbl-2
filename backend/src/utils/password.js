const bcrypt = require('bcrypt');
const env = require('../config/env');

const hashPassword = async (password) => {
  return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
};

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword,
};

const divisionRepository = require('../repositories/division.repository');

class DivisionService {
  async getActiveDivisions() {
    return divisionRepository.findAllActive();
  }
}

module.exports = new DivisionService();

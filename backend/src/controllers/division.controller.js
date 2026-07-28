const divisionService = require('../services/division.service');
const asyncHandler = require('../utils/asyncHandler');

class DivisionController {
  getActiveDivisions = asyncHandler(async (req, res) => {
    const divisions = await divisionService.getActiveDivisions();
    
    res.status(200).json({
      success: true,
      message: 'Active divisions retrieved successfully.',
      data: divisions
    });
  });
}

module.exports = new DivisionController();

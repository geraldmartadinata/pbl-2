const applicationService = require('../services/application.service');
const asyncHandler = require('../utils/asyncHandler');

class ApplicationController {
  submitApplication = asyncHandler(async (req, res) => {
    const application = await applicationService.submitApplication(req.user.id, req.body);
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      data: {
        applicationId: application.id,
        status: application.status
      }
    });
  });

  getMyApplication = asyncHandler(async (req, res) => {
    const application = await applicationService.getMyApplication(req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Application retrieved successfully.',
      data: application
    });
  });

  updateMyApplication = asyncHandler(async (req, res) => {
    const updatedApplication = await applicationService.updateMyApplication(req.user.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Application updated successfully.',
      data: {
        applicationId: updatedApplication.id,
        status: updatedApplication.status
      }
    });
  });
}

module.exports = new ApplicationController();

const adminService = require('../services/admin.service');
const asyncHandler = require('../utils/asyncHandler');

class AdminController {
  getStatistics = asyncHandler(async (req, res) => {
    const stats = await adminService.getStatistics();
    
    res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully.',
      data: stats
    });
  });

  getApplications = asyncHandler(async (req, res) => {
    const data = await adminService.getApplications(req.query);
    
    res.status(200).json({
      success: true,
      message: 'Applications retrieved successfully.',
      data
    });
  });

  getApplicationDetail = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    const application = await adminService.getApplicationDetail(applicationId);
    
    res.status(200).json({
      success: true,
      message: 'Application detail retrieved successfully.',
      data: application
    });
  });

  updateApplicationStatus = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    const updatedApplication = await adminService.updateApplicationStatus(
      applicationId, 
      req.body,
      req.user.id
    );
    
    res.status(200).json({
      success: true,
      message: 'Application status updated successfully.',
      data: updatedApplication
    });
  });
}

module.exports = new AdminController();

const applicationRepository = require('../repositories/application.repository');
const ApiError = require('../utils/ApiError');

class AdminService {
  async getStatistics() {
    return applicationRepository.getStatistics();
  }

  async getApplications(params) {
    return applicationRepository.findApplications(params);
  }

  async getApplicationDetail(applicationId) {
    const application = await applicationRepository.findByIdWithDetails(applicationId);
    if (!application) {
      throw new ApiError(404, 'Application not found.', 'APPLICATION_NOT_FOUND');
    }
    return application;
  }

  async updateApplicationStatus(applicationId, updateData, adminId) {
    const existingApplication = await applicationRepository.findById(applicationId);
    if (!existingApplication) {
      throw new ApiError(404, 'Application not found.', 'APPLICATION_NOT_FOUND');
    }

    const updatedApplication = await applicationRepository.updateStatus(applicationId, {
      ...updateData,
      reviewerId: adminId
    });

    return updatedApplication;
  }
}

module.exports = new AdminService();

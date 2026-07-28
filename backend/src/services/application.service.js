const applicationRepository = require('../repositories/application.repository');
const divisionRepository = require('../repositories/division.repository');
const ApiError = require('../utils/ApiError');

class ApplicationService {
  async submitApplication(userId, applicationData) {
    // check for existing application
    const existingApplication = await applicationRepository.findByUserId(userId);
    if (existingApplication) {
      throw new ApiError(409, 'You have already submitted an application.', 'APPLICATION_ALREADY_EXISTS');
    }

    // verify division exists and is active
    const division = await divisionRepository.findById(applicationData.divisionId);
    if (!division) {
      throw new ApiError(404, 'Division not found.', 'DIVISION_NOT_FOUND');
    }
    if (!division.is_active) {
      throw new ApiError(422, 'Selected division is currently inactive.', 'DIVISION_INACTIVE');
    }

    const application = await applicationRepository.create({
      ...applicationData,
      userId
    });

    return application;
  }

  async getMyApplication(userId) {
    const application = await applicationRepository.findByUserId(userId);
    if (!application) {
      throw new ApiError(404, 'Application not found.', 'APPLICATION_NOT_FOUND');
    }
    return application;
  }

  async updateMyApplication(userId, updateData) {
    const existingApplication = await applicationRepository.findByUserId(userId);
    
    if (!existingApplication) {
      throw new ApiError(404, 'Application not found.', 'APPLICATION_NOT_FOUND');
    }

    if (existingApplication.status !== 'PENDING') {
      throw new ApiError(422, 'Only pending applications can be edited.', 'APPLICATION_NOT_EDITABLE');
    }

    if (updateData.divisionId) {
      const division = await divisionRepository.findById(updateData.divisionId);
      if (!division) {
        throw new ApiError(404, 'Division not found.', 'DIVISION_NOT_FOUND');
      }
      if (!division.is_active) {
        throw new ApiError(422, 'Selected division is currently inactive.', 'DIVISION_INACTIVE');
      }
    }

    const updatedApplication = await applicationRepository.updatePendingApplication(
      existingApplication.id,
      updateData
    );

    return updatedApplication;
  }
}

module.exports = new ApplicationService();

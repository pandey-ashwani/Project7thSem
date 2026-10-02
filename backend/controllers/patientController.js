const patientService = require('../services/patientService');
const { successResponse } = require('../utils/response');

class PatientController {
  // 1. Patient Dashboard
  async getDashboard(req, res, next) {
    try {
      const data = await patientService.getDashboard(req.user._id);
      return successResponse(res, 'Patient dashboard loaded', data);
    } catch (err) {
      next(err);
    }
  }

  // 2. Full Medical Records & Prescriptions
  async getRecords(req, res, next) {
    try {
      const records = await patientService.getRecords(req.user._id);
      return successResponse(res, 'Medical history and prescriptions loaded', records);
    } catch (err) {
      next(err);
    }
  }

  // 3. Patient Profile
  async getProfile(req, res, next) {
    try {
      const profile = await patientService.getProfile(req.user._id);
      return successResponse(res, 'Patient profile loaded', profile);
    } catch (err) {
      next(err);
    }
  }

  // 4. Acknowledge Assignment Notification
  async acknowledgeAssignment(req, res, next) {
    try {
      const result = await patientService.acknowledgeAssignment(req.user._id);
      return successResponse(res, 'Assignment acknowledged', result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PatientController();

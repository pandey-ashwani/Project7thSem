const superAdminService = require('../services/superAdminService');
const { successResponse } = require('../utils/response');

class SuperAdminController {
  // 1. Statewide Analytics & Metrics
  async getAnalytics(req, res, next) {
    try {
      const data = await superAdminService.getAnalytics();
      return successResponse(res, 'Statewide healthcare analytics loaded', data);
    } catch (err) {
      next(err);
    }
  }

  // 2. Statewide Patients Surveillance
  async getPatients(req, res, next) {
    try {
      const filters = {
        district: req.query.district,
        hospital: req.query.hospital,
        disease: req.query.disease,
        search: req.query.search
      };
      const patients = await superAdminService.getPatients(filters);
      return successResponse(res, 'Statewide patients loaded', patients);
    } catch (err) {
      next(err);
    }
  }

  // 3. Statewide Doctors
  async getDoctors(req, res, next) {
    try {
      const doctors = await superAdminService.getDoctors();
      return successResponse(res, 'Statewide doctors loaded', doctors);
    } catch (err) {
      next(err);
    }
  }

  // 4. Hospital Network
  async getHospitals(req, res, next) {
    try {
      const hospitals = await superAdminService.getHospitals();
      return successResponse(res, 'Hospital network directory loaded', hospitals);
    } catch (err) {
      next(err);
    }
  }

  // 5. Policies CRUD
  async getPolicies(req, res, next) {
    try {
      const policies = await superAdminService.getPolicies();
      return successResponse(res, 'State health policies loaded', policies);
    } catch (err) {
      next(err);
    }
  }

  async createPolicy(req, res, next) {
    try {
      const policy = await superAdminService.createPolicy(req.body, req.user._id);
      return successResponse(res, 'Health policy created successfully!', policy, 201);
    } catch (err) {
      next(err);
    }
  }

  async updatePolicy(req, res, next) {
    try {
      const updated = await superAdminService.updatePolicy(req.params.id, req.body);
      return successResponse(res, 'Health policy updated successfully', updated);
    } catch (err) {
      next(err);
    }
  }

  async deletePolicy(req, res, next) {
    try {
      await superAdminService.deletePolicy(req.params.id);
      return successResponse(res, 'Health policy deleted successfully', null);
    } catch (err) {
      next(err);
    }
  }

  // 6. SuperAdmin Profile
  async getProfile(req, res, next) {
    try {
      const profile = await superAdminService.getProfile(req.user._id);
      return successResponse(res, 'SuperAdmin profile loaded', profile);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SuperAdminController();

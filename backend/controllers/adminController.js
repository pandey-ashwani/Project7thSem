const adminService = require('../services/adminService');
const { successResponse } = require('../utils/response');

class AdminController {
  // 1. Admin Dashboard
  async getDashboard(req, res, next) {
    try {
      const data = await adminService.getDashboard(req.user);
      return successResponse(res, 'Admin dashboard metrics loaded', data);
    } catch (err) {
      next(err);
    }
  }

  // 2. Check Patient by Aadhaar
  async checkPatient(req, res, next) {
    try {
      const aadhar = req.validatedAadhar || req.query.aadhar || req.body.aadhar;
      const data = await adminService.checkPatient(aadhar);
      return successResponse(res, data.exists ? 'Patient record found' : 'Patient not registered', data);
    } catch (err) {
      next(err);
    }
  }

  // 3. Register New Patient
  async registerPatient(req, res, next) {
    try {
      const newPatient = await adminService.registerPatient(req.user, req.body);
      return successResponse(res, 'Patient registered successfully in hospital system!', newPatient, 201);
    } catch (err) {
      next(err);
    }
  }

  // 4. Get All Hospital Patients
  async getPatients(req, res, next) {
    try {
      const patients = await adminService.getPatients(req.user);
      return successResponse(res, 'Hospital patients list loaded', patients);
    } catch (err) {
      next(err);
    }
  }

  // 5. Get Patient Detail by ID
  async getPatientById(req, res, next) {
    try {
      const patient = await adminService.getPatientById(req.params.id);
      return successResponse(res, 'Patient details loaded', patient);
    } catch (err) {
      next(err);
    }
  }

  // 6. Assign / Reassign Doctor
  async assignDoctor(req, res, next) {
    try {
      const patientId = req.params.id || req.body.patientId;
      const { doctorId, disease, appointmentDate, notes } = req.body;
      const result = await adminService.assignDoctor(patientId, doctorId, disease, appointmentDate, notes);
      return successResponse(res, `Doctor assigned successfully!`, result.patient);
    } catch (err) {
      next(err);
    }
  }

  // 7. End Active Consultation
  async endConsultation(req, res, next) {
    try {
      const patientId = req.params.id || req.body.patientId;
      const patient = await adminService.endConsultation(patientId);
      return successResponse(res, 'Consultation ended and archived to history.', patient);
    } catch (err) {
      next(err);
    }
  }

  // 8. Add New Doctor
  async addDoctor(req, res, next) {
    try {
      const doctor = await adminService.addDoctor(req.user, req.body);
      return successResponse(res, `Doctor Dr. ${doctor.name} registered successfully!`, doctor, 201);
    } catch (err) {
      next(err);
    }
  }

  // 9. List All Doctors for Hospital
  async getDoctors(req, res, next) {
    try {
      const doctors = await adminService.getDoctors(req.user);
      return successResponse(res, 'Doctors list loaded', doctors);
    } catch (err) {
      next(err);
    }
  }

  // 10. Get Doctor Detail
  async getDoctorById(req, res, next) {
    try {
      const data = await adminService.getDoctorById(req.params.id);
      return successResponse(res, 'Doctor profile and assigned patients loaded', data);
    } catch (err) {
      next(err);
    }
  }

  // 11. Admin Profile
  async getProfile(req, res, next) {
    try {
      const admin = await adminService.getProfile(req.user._id);
      return successResponse(res, 'Admin profile loaded', admin);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();

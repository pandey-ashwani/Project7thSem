const doctorService = require('../services/doctorService');
const { successResponse } = require('../utils/response');

class DoctorController {
  // 1. Clinical Dashboard
  async getDashboard(req, res, next) {
    try {
      const data = await doctorService.getDashboard(req.user);
      return successResponse(res, 'Clinical dashboard loaded', data);
    } catch (err) {
      next(err);
    }
  }

  // 2. Today's Appointments & Active Patients
  async getTodayAppointments(req, res, next) {
    try {
      const patients = await doctorService.getTodayAppointments(req.user);
      return successResponse(res, "Today's appointments loaded", patients);
    } catch (err) {
      next(err);
    }
  }

  // 3. Upcoming Appointments
  async getUpcomingAppointments(req, res, next) {
    try {
      const patients = await doctorService.getUpcomingAppointments(req.user);
      return successResponse(res, 'Upcoming appointments loaded', patients);
    } catch (err) {
      next(err);
    }
  }

  // 4. Patient History (All Treated Patients)
  async getPatientHistory(req, res, next) {
    try {
      const patients = await doctorService.getPatientHistory(req.user);
      return successResponse(res, 'Patient consultation history loaded', patients);
    } catch (err) {
      next(err);
    }
  }

  // 5. Patient Clinical Details
  async getPatientDetails(req, res, next) {
    try {
      const patient = await doctorService.getPatientDetails(req.user, req.params.id);
      return successResponse(res, 'Patient clinical record loaded', patient);
    } catch (err) {
      next(err);
    }
  }

  // 6. Submit Digital Prescription
  async createPrescription(req, res, next) {
    try {
      const payload = {
        patientId: req.body.patientId || req.params.id,
        medicines: req.validMedicines || req.body.medicines,
        notes: req.body.notes,
        completeConsultation: req.body.completeConsultation
      };

      const result = await doctorService.createPrescription(req.user, payload);
      return successResponse(res, 'Prescription generated successfully!', result, 201);
    } catch (err) {
      next(err);
    }
  }

  // 7. Get Doctor Profile
  async getProfile(req, res, next) {
    try {
      const doctor = await doctorService.getProfile(req.user._id);
      return successResponse(res, 'Doctor profile loaded', doctor);
    } catch (err) {
      next(err);
    }
  }

  // 8. Update Doctor Profile
  async updateProfile(req, res, next) {
    try {
      const updated = await doctorService.updateProfile(req.user._id, req.body);
      return successResponse(res, 'Doctor profile updated successfully', updated);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DoctorController();

const { Patient } = require('../models');
const { NotFoundError } = require('../utils/errors');

class PatientService {
  // 1. Patient Dashboard
  async getDashboard(patientId) {
    const patient = await Patient.findById(patientId)
      .populate('doctor', 'name specialization hospital email phone')
      .populate('consultations.doctor', 'name specialization hospital')
      .populate('appointments.doctor', 'name specialization hospital');

    if (!patient) {
      throw new NotFoundError('Patient record not found.');
    }

    const activeConsultation = patient.consultations?.find((c) => c.status === 'active');
    const upcomingAppointment = patient.appointments?.find(
      (a) => new Date(a.appointmentDate) >= new Date() && (a.status === 'active' || a.status === 'pending')
    );

    let latestPrescription = null;
    if (patient.consultations && patient.consultations.length > 0) {
      for (let i = patient.consultations.length - 1; i >= 0; i--) {
        const c = patient.consultations[i];
        if (c.prescriptions && c.prescriptions.length > 0) {
          latestPrescription = {
            doctorName: c.doctorName,
            disease: c.disease,
            prescription: c.prescriptions[c.prescriptions.length - 1]
          };
          break;
        }
      }
    }

    return {
      patient,
      activeConsultation,
      upcomingAppointment,
      latestPrescription
    };
  }

  // 2. Full Medical Records & Prescriptions
  async getRecords(patientId) {
    const patient = await Patient.findById(patientId)
      .populate('doctor', 'name specialization hospital email phone')
      .populate('consultations.doctor', 'name specialization hospital')
      .populate('appointments.doctor', 'name specialization hospital');

    if (!patient) {
      throw new NotFoundError('Patient record not found.');
    }

    return {
      consultations: patient.consultations || [],
      appointments: patient.appointments || []
    };
  }

  // 3. Patient Profile
  async getProfile(patientId) {
    const patient = await Patient.findById(patientId)
      .populate('doctor', 'name specialization hospital email phone');

    if (!patient) {
      throw new NotFoundError('Patient profile not found.');
    }

    return patient;
  }

  // 4. Acknowledge Doctor Assignment Notification
  async acknowledgeAssignment(patientId) {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new NotFoundError('Patient profile not found.');
    }

    if (patient.assignmentNotification) {
      patient.assignmentNotification.viewed = true;
      await patient.save();
    }

    return { acknowledged: true };
  }
}

module.exports = new PatientService();

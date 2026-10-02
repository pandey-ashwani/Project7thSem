const { Doctor, Patient } = require('../models');
const { BadRequestError, NotFoundError } = require('../utils/errors');

class DoctorService {
  // 1. Clinical Dashboard Stats
  async getDashboard(doctor) {
    const doctorId = doctor._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Today's appointments / active patients
    const todayPatients = await Patient.find({
      $or: [
        {
          appointments: {
            $elemMatch: {
              doctor: doctorId,
              status: { $in: ['active', 'today', 'pending'] },
              appointmentDate: { $gte: startOfDay, $lte: endOfDay }
            }
          }
        },
        {
          'consultations.doctor': doctorId,
          'consultations.status': 'active'
        }
      ]
    }).sort({ updatedAt: -1 });

    // Upcoming
    const upcomingPatients = await Patient.find({
      appointments: {
        $elemMatch: {
          doctor: doctorId,
          status: { $in: ['active', 'pending'] },
          appointmentDate: { $gt: endOfDay }
        }
      }
    });

    // History of all treated patients
    const historyPatients = await Patient.find({
      'consultations.doctor': doctorId
    });

    const completedCount = historyPatients.filter((p) =>
      p.consultations?.some(
        (c) => c.doctor.toString() === doctorId.toString() && c.status === 'completed'
      )
    ).length;

    return {
      stats: {
        todayAppointmentsCount: todayPatients.length,
        upcomingAppointmentsCount: upcomingPatients.length,
        completedConsultationsCount: completedCount,
        totalPatientsTreated: historyPatients.length
      },
      todayPatients: todayPatients.slice(0, 5),
      doctor
    };
  }

  // 2. Today's Appointments
  async getTodayAppointments(doctor) {
    const doctorId = doctor._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const patients = await Patient.find({
      $or: [
        {
          appointments: {
            $elemMatch: {
              doctor: doctorId,
              status: { $in: ['active', 'today', 'pending'] },
              appointmentDate: { $gte: startOfDay, $lte: endOfDay }
            }
          }
        },
        {
          'consultations.doctor': doctorId,
          'consultations.status': 'active'
        }
      ]
    })
      .populate('consultations.doctor', 'name specialization')
      .sort({ updatedAt: -1 });

    return patients;
  }

  // 3. Upcoming Appointments
  async getUpcomingAppointments(doctor) {
    const doctorId = doctor._id;
    const now = new Date();

    const patients = await Patient.find({
      appointments: {
        $elemMatch: {
          doctor: doctorId,
          status: { $in: ['active', 'pending'] },
          appointmentDate: { $gt: now }
        }
      }
    }).sort({ 'appointments.appointmentDate': 1 });

    return patients;
  }

  // 4. Patient History (All treated patients)
  async getPatientHistory(doctor) {
    const doctorId = doctor._id;
    const patients = await Patient.find({
      'consultations.doctor': doctorId
    }).sort({ updatedAt: -1 });

    return patients;
  }

  // 5. Patient Clinical Details
  async getPatientDetails(doctor, patientId) {
    const patient = await Patient.findById(patientId)
      .populate('doctor', 'name specialization hospital')
      .populate('consultations.doctor', 'name specialization hospital')
      .populate('appointments.doctor', 'name specialization hospital');

    if (!patient) {
      throw new NotFoundError('Patient record not found.');
    }

    return patient;
  }

  // 6. Create Digital Prescription
  async createPrescription(doctor, data) {
    const { patientId, medicines, notes, completeConsultation } = data;
    const doctorId = doctor._id;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new NotFoundError('Patient record not found.');
    }

    const prescriptionMedicines = medicines.map((m) => ({
      name: (m.name || m.medicineName || '').trim(),
      dosage: (m.dosage || '').trim(),
      duration: (m.duration || '').trim(),
      instructions: (m.instructions || '').trim()
    }));

    const newPrescription = {
      medicines: prescriptionMedicines,
      date: new Date(),
      notes: notes ? notes.trim() : ''
    };

    // Find active consultation with this doctor
    let activeConsultation = patient.consultations?.find(
      (c) => c.doctor.toString() === doctorId.toString() && c.status === 'active'
    );

    if (!activeConsultation) {
      // Create new consultation if none active
      patient.consultations.push({
        disease: patient.disease || 'Consultation',
        doctor: doctorId,
        doctorName: doctor.name,
        startDate: new Date(),
        status: completeConsultation ? 'completed' : 'active',
        endDate: completeConsultation ? new Date() : null,
        prescriptions: [newPrescription]
      });
    } else {
      activeConsultation.prescriptions.push(newPrescription);
      if (completeConsultation) {
        activeConsultation.status = 'completed';
        activeConsultation.endDate = new Date();
      }
    }

    // Update any matching today's appointment
    if (patient.appointments) {
      patient.appointments.forEach((app) => {
        if (app.doctor.toString() === doctorId.toString() && app.status === 'active') {
          if (completeConsultation) {
            app.status = 'completed';
          }
          app.prescriptions.push(newPrescription);
        }
      });
    }

    await patient.save();

    return {
      patient,
      prescription: newPrescription
    };
  }

  // 7. Get Doctor Profile
  async getProfile(doctorId) {
    const doctor = await Doctor.findById(doctorId).populate('admin', 'hospital district state');
    if (!doctor) {
      throw new NotFoundError('Doctor profile not found.');
    }
    return doctor;
  }

  // 8. Update Doctor Profile
  async updateProfile(doctorId, data) {
    const { name, email, phone, specialization, qualification, experience } = data;

    const updated = await Doctor.findByIdAndUpdate(
      doctorId,
      {
        name: name.trim(),
        email: email.trim(),
        phone: String(phone).trim(),
        specialization: specialization.trim(),
        qualification: qualification.trim(),
        experience: Number(experience)
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new NotFoundError('Doctor profile not found.');
    }

    return updated;
  }
}

module.exports = new DoctorService();

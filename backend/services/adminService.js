const { Admin, Doctor, Patient } = require('../models');
const { BadRequestError, NotFoundError, ConflictError } = require('../utils/errors');

class AdminService {
  // 1. Dashboard Stats
  async getDashboard(admin) {
    const adminId = admin._id;
    const hospital = admin.hospital;

    const totalDoctors = await Doctor.countDocuments({ admin: adminId });
    const totalPatients = await Patient.countDocuments({
      $or: [{ admin: adminId }, { hospital: hospital }]
    });

    const patients = await Patient.find({
      $or: [{ admin: adminId }, { hospital: hospital }]
    })
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });

    let unassignedCount = 0;
    let completedCount = 0;
    let activeCount = 0;
    const unassignedList = [];

    patients.forEach((p) => {
      const isUnassigned = !p.doctor || p.assignmentStatus === 'pending_assignment';
      if (isUnassigned) {
        unassignedCount++;
        unassignedList.push(p);
      } else {
        const hasActive = p.consultations?.some((c) => c.status === 'active');
        if (hasActive) {
          activeCount++;
        } else if (p.consultations?.length > 0) {
          completedCount++;
        }
      }
    });

    return {
      stats: {
        totalDoctors,
        totalPatients,
        unassignedPatients: unassignedCount,
        activeConsultations: activeCount,
        completedConsultations: completedCount
      },
      unassignedList,
      recentPatients: patients.slice(0, 10),
      admin
    };
  }

  // 2. Check Patient by Aadhaar
  async checkPatient(aadhar) {
    const cleanAadhar = aadhar.toString().trim();
    const patient = await Patient.findOne({ aadhar: cleanAadhar })
      .populate('doctor', 'name specialization hospital email phone')
      .populate('consultations.doctor', 'name specialization hospital')
      .populate('appointments.doctor', 'name specialization hospital');

    if (patient) {
      return {
        exists: true,
        patient
      };
    }

    return {
      exists: false,
      patient: null,
      aadhar: cleanAadhar
    };
  }

  // 3. Register New Patient
  async registerPatient(admin, data) {
    const { name, age, aadhar, disease, username, password, doctorId } = data;
    const cleanAadhar = aadhar.toString().trim();

    const existingPatient = await Patient.findOne({ aadhar: cleanAadhar });
    if (existingPatient) {
      throw new ConflictError('A patient with this Aadhaar number is already registered in the system.');
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new BadRequestError('Invalid doctor selected. Doctor does not exist.');
    }

    const finalUsername = username ? username.trim() : `patient_${cleanAadhar.slice(-4)}`;

    const newPatient = new Patient({
      name: name.trim(),
      age: String(age).trim(),
      aadhar: cleanAadhar,
      disease: disease.trim(),
      district: admin.district,
      state: admin.state,
      hospital: admin.hospital,
      admin: admin._id,
      doctor: doctor._id,
      role: 'patient',
      username: finalUsername,
      consultations: [
        {
          disease: disease.trim(),
          doctor: doctor._id,
          doctorName: doctor.name,
          startDate: new Date(),
          status: 'active'
        }
      ]
    });

    const registeredPatient = await Patient.register(newPatient, password || 'Patient@1234');
    return registeredPatient;
  }

  // 4. Get All Hospital Patients
  async getPatients(admin) {
    const adminId = admin._id;
    const hospital = admin.hospital;

    const patients = await Patient.find({
      $or: [{ admin: adminId }, { hospital: hospital }]
    })
      .populate('doctor', 'name specialization email phone')
      .sort({ createdAt: -1 });

    return patients;
  }

  // 5. Get Patient by ID
  async getPatientById(patientId) {
    const patient = await Patient.findById(patientId)
      .populate('doctor', 'name specialization hospital email phone')
      .populate('consultations.doctor', 'name specialization hospital')
      .populate('appointments.doctor', 'name specialization hospital');

    if (!patient) {
      throw new NotFoundError('Patient record not found.');
    }

    return patient;
  }

  // 6. Assign / Reassign Doctor
  async assignDoctor(patientId, doctorId, disease, appointmentDate, notes) {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new NotFoundError('Patient not found.');
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new NotFoundError('Doctor not found.');
    }

    const activeDisease = disease || patient.disease || 'General Consultation';

    // Mark any existing active consultation as completed
    const activeConsultation = patient.consultations?.find((c) => c.status === 'active');
    if (activeConsultation) {
      activeConsultation.endDate = new Date();
      activeConsultation.status = 'completed';
    }

    // Push new active consultation
    patient.consultations.push({
      disease: activeDisease,
      doctor: doctor._id,
      doctorName: doctor.name,
      startDate: new Date(),
      status: 'active'
    });

    // Schedule appointment date (or today)
    const appointmentDateObj = appointmentDate ? new Date(appointmentDate) : new Date();
    appointmentDateObj.setHours(0, 0, 0, 0);

    patient.appointments.push({
      doctor: doctor._id,
      doctorName: doctor.name,
      disease: activeDisease,
      appointmentDate: appointmentDateObj,
      status: 'active',
      notes: notes || ''
    });

    patient.doctor = doctor._id;
    patient.disease = activeDisease;
    patient.assignmentStatus = 'assigned';
    patient.assignmentNotification = {
      assigned: true,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      consultationDate: appointmentDateObj,
      notes: notes || '',
      viewed: false,
      assignedAt: new Date()
    };

    await patient.save();

    return {
      patient,
      doctorName: doctor.name
    };
  }

  // 7. End Active Consultation
  async endConsultation(patientId) {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new NotFoundError('Patient not found.');
    }

    const activeConsultation = patient.consultations?.find((c) => c.status === 'active');
    if (!activeConsultation) {
      throw new BadRequestError('No active consultation found to end.');
    }

    activeConsultation.endDate = new Date();
    activeConsultation.status = 'completed';

    await patient.save();
    return patient;
  }

  // 8. Add New Doctor
  async addDoctor(admin, data) {
    const { name, email, phone, specialization, experience, qualification, username, password } = data;

    const existing = await Doctor.findOne({ username });
    if (existing) {
      throw new ConflictError('A doctor with this username already exists.');
    }

    const newDoctor = new Doctor({
      name: name.trim(),
      email: email.trim(),
      phone: String(phone),
      specialization: specialization.trim(),
      experience: Number(experience),
      qualification: qualification.trim(),
      hospital: admin.hospital,
      district: admin.district,
      state: admin.state,
      admin: admin._id,
      role: 'doctor',
      username: username.trim()
    });

    const registeredDoctor = await Doctor.register(newDoctor, password);
    return registeredDoctor;
  }

  // 9. Get Doctors for this Hospital
  async getDoctors(admin) {
    const doctors = await Doctor.find({ admin: admin._id }).sort({ createdAt: -1 });
    return doctors;
  }

  // 10. Get Doctor Detail with Assigned Patients
  async getDoctorById(doctorId) {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new NotFoundError('Doctor not found.');
    }

    const assignedPatients = await Patient.find({
      $or: [
        { doctor: doctor._id },
        { 'consultations.doctor': doctor._id }
      ]
    }).populate('doctor', 'name specialization');

    return {
      doctor,
      assignedPatients
    };
  }

  // 11. Get Admin Profile
  async getProfile(adminId) {
    const admin = await Admin.findById(adminId).select('-hash -salt');
    if (!admin) {
      throw new NotFoundError('Admin profile not found.');
    }

    const doctorCount = await Doctor.countDocuments({ admin: admin._id });
    const patientCount = await Patient.countDocuments({
      $or: [{ admin: admin._id }, { hospital: admin.hospital }]
    });

    const adminObj = admin.toObject ? admin.toObject() : { ...admin };
    adminObj.stats = {
      totalDoctors: doctorCount,
      totalPatients: patientCount
    };

    return adminObj;
  }
}

module.exports = new AdminService();

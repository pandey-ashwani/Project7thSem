const jwt = require('jsonwebtoken');
const { Admin, Doctor, Patient, SuperAdmin } = require('../models');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const { BadRequestError, UnauthorizedError, ConflictError, NotFoundError } = require('../utils/errors');

const sanitizeUser = (user) => {
  if (!user) return null;
  return {
    _id: user._id,
    id: user._id,
    name: user.name,
    email: user.email || '',
    role: user.role,
    username: user.username,
    hospital: user.hospital || '',
    district: user.district || '',
    state: user.state || '',
    phone: user.phone || '',
    specialization: user.specialization || '',
    qualification: user.qualification || '',
    experience: user.experience || 0,
    aadhar: user.aadhar || '',
    age: user.age || '',
    createdAt: user.createdAt
  };
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper to authenticate using passport-local-mongoose promise-based wrapper
const authenticateUserWithModel = (Model, username, password) => {
  return new Promise((resolve, reject) => {
    Model.authenticate()(username, password, (err, user, info) => {
      if (err) return reject(err);
      if (!user) return resolve({ user: null, info });
      resolve({ user, info: null });
    });
  });
};

class AuthService {
  // Admin Register
  async registerAdmin(data) {
    const { name, email, phone, district, state, hospital, username, password } = data;

    const existingUsername = await Admin.findOne({ username });
    if (existingUsername) {
      throw new ConflictError('Username already taken. Please choose another.');
    }

    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) {
      throw new ConflictError('An admin account with this email already exists.');
    }

    const newAdmin = new Admin({
      name,
      email,
      phone: String(phone),
      district,
      state,
      hospital,
      username,
      role: 'admin'
    });

    const registered = await Admin.register(newAdmin, password);
    const token = generateToken(registered);

    return {
      token,
      user: sanitizeUser(registered)
    };
  }

  // Admin Login
  async loginAdmin(username, password) {
    const { user, info } = await authenticateUserWithModel(Admin, username, password);
    if (!user) {
      throw new UnauthorizedError(info?.message || 'Invalid Admin username or password.');
    }
    const token = generateToken(user);
    return {
      token,
      user: sanitizeUser(user)
    };
  }

  // Doctor Login
  async loginDoctor(username, password) {
    const { user, info } = await authenticateUserWithModel(Doctor, username, password);
    if (!user) {
      throw new UnauthorizedError(info?.message || 'Invalid Doctor credentials. Please check your username and password.');
    }
    const token = generateToken(user);
    return {
      token,
      user: sanitizeUser(user)
    };
  }

  // Patient Register (Self Signup)
  async registerPatient(data) {
    const { name, age, username, disease, district, state, hospital, doctorName, password, aadhar, adminId } = data;

    const existing = await Patient.findOne({ username });
    if (existing) {
      throw new ConflictError('Username already taken. Please select another username.');
    }

    // Clean text fields
    const cleanHospital = hospital ? hospital.trim() : '';
    const cleanState = state ? state.trim() : '';
    const cleanDistrict = district ? district.trim() : '';

    // 1. Identify Hospital Admin
    let hospitalAdmin = null;
    if (adminId) {
      hospitalAdmin = await Admin.findById(adminId);
    }
    if (!hospitalAdmin && cleanHospital) {
      hospitalAdmin = await Admin.findOne({
        hospital: { $regex: new RegExp(`^${cleanHospital.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
      });
    }

    // 2. Doctor Lookup (ONLY if explicitly passed, otherwise leave unassigned for Hospital Admin to assign)
    let doctor = null;
    if (doctorName && doctorName.trim()) {
      doctor = await Doctor.findOne({
        name: { $regex: new RegExp(`^${doctorName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
      });
    }

    // 3. Aadhaar Verification
    let patientAadhar = aadhar ? String(aadhar).trim() : null;
    if (patientAadhar) {
      if (!/^\d{12}$/.test(patientAadhar)) {
        throw new BadRequestError('Aadhaar must be exactly 12 numerical digits.');
      }
      const existingAadhar = await Patient.findOne({ aadhar: patientAadhar });
      if (existingAadhar) {
        throw new ConflictError('A patient with this Aadhaar number is already registered.');
      }
    } else {
      // Generate unique mock Aadhaar if user self-registers without it to satisfy schema
      const randomSuffix = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      patientAadhar = randomSuffix;
    }

    // 4. Create consultation entry ONLY if doctor was explicitly selected
    const consultations = [];
    if (doctor && disease) {
      consultations.push({
        disease: disease.trim(),
        doctor: doctor._id,
        doctorName: doctor.name,
        startDate: new Date(),
        status: 'active'
      });
    }

    const newPatient = new Patient({
      name: name.trim(),
      age: String(age).trim(),
      username: username.trim(),
      aadhar: patientAadhar,
      disease: disease ? disease.trim() : 'General Checkup',
      district: cleanDistrict || hospitalAdmin?.district || 'General District',
      state: cleanState || hospitalAdmin?.state || 'General State',
      hospital: cleanHospital || hospitalAdmin?.hospital || 'General Hospital',
      admin: hospitalAdmin ? hospitalAdmin._id : undefined,
      doctor: doctor ? doctor._id : undefined,
      role: 'patient',
      assignmentStatus: doctor ? 'assigned' : 'pending_assignment',
      assignmentNotification: {
        assigned: !!doctor,
        doctorName: doctor ? doctor.name : '',
        doctorSpecialization: doctor ? doctor.specialization : '',
        consultationDate: doctor ? new Date() : undefined,
        viewed: !doctor
      },
      consultations
    });

    const registered = await Patient.register(newPatient, password);
    const token = generateToken(registered);

    return {
      token,
      user: sanitizeUser(registered)
    };
  }

  // Patient Login
  async loginPatient(username, password) {
    const { user, info } = await authenticateUserWithModel(Patient, username, password);
    if (!user) {
      throw new UnauthorizedError(info?.message || 'Invalid Patient credentials.');
    }
    const token = generateToken(user);
    return {
      token,
      user: sanitizeUser(user)
    };
  }

  // SuperAdmin Register
  async registerSuperAdmin(data) {
    const { name, email, phone, username, password } = data;

    const existing = await SuperAdmin.findOne({ username });
    if (existing) {
      throw new ConflictError('Username already taken.');
    }

    const existingEmail = await SuperAdmin.findOne({ email });
    if (existingEmail) {
      throw new ConflictError('A SuperAdmin account with this email already exists.');
    }

    const newSuperAdmin = new SuperAdmin({
      name,
      email,
      phone: Number(phone) || 0,
      username,
      role: 'superAdmin'
    });

    const registered = await SuperAdmin.register(newSuperAdmin, password);
    const token = generateToken(registered);

    return {
      token,
      user: sanitizeUser(registered)
    };
  }

  // SuperAdmin Login
  async loginSuperAdmin(username, password) {
    const { user, info } = await authenticateUserWithModel(SuperAdmin, username, password);
    if (!user) {
      throw new UnauthorizedError(info?.message || 'Invalid SuperAdmin credentials.');
    }
    const token = generateToken(user);
    return {
      token,
      user: sanitizeUser(user)
    };
  }

  // Get Public Hospitals Directory Grouped & Sorted by State
  async getHospitalsDirectory() {
    const adminHospitals = await Admin.find({}, 'name hospital district state _id').lean();
    const doctorHospitals = await Doctor.find({}, 'name hospital district state admin _id').lean();

    const normalize = (str) => (str || '').trim();
    const toTitleCase = (str) => {
      if (!str) return '';
      return str
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const hospitalMap = new Map();

    // 1. Process Hospital Admins
    adminHospitals.forEach((item) => {
      const hName = normalize(item.hospital);
      const sName = toTitleCase(item.state);
      const dName = toTitleCase(item.district);
      if (!hName || !sName) return;

      const key = `${sName.toLowerCase()}||${hName.toLowerCase()}`;
      if (!hospitalMap.has(key)) {
        hospitalMap.set(key, {
          hospital: hName,
          state: sName,
          district: dName,
          adminId: item._id,
          rawState: item.state,
          rawDistrict: item.district
        });
      }
    });

    // 2. Supplement with any Doctor Hospitals
    doctorHospitals.forEach((item) => {
      const hName = normalize(item.hospital);
      const sName = toTitleCase(item.state);
      const dName = toTitleCase(item.district);
      if (!hName || !sName) return;

      const key = `${sName.toLowerCase()}||${hName.toLowerCase()}`;
      if (!hospitalMap.has(key)) {
        hospitalMap.set(key, {
          hospital: hName,
          state: sName,
          district: dName,
          adminId: item.admin || null,
          rawState: item.state,
          rawDistrict: item.district
        });
      }
    });

    const allHospitals = Array.from(hospitalMap.values());

    // Extract sorted unique states
    const states = Array.from(new Set(allHospitals.map((h) => h.state))).sort((a, b) =>
      a.localeCompare(b)
    );

    // Group hospitals by state, sorted alphabetically by hospital name
    const hospitalsByState = {};
    states.forEach((st) => {
      hospitalsByState[st] = allHospitals
        .filter((h) => h.state === st)
        .sort((a, b) => a.hospital.localeCompare(b.hospital));
    });

    return {
      states,
      hospitalsByState,
      allHospitals
    };
  }

  // Get Public Live System Stats directly from MongoDB Database
  async getPublicStats() {
    const [patientCount, adminHospitals, doctorCount, activeConsultations] = await Promise.all([
      Patient.countDocuments({}),
      Admin.find({}, 'hospital state district').lean(),
      Doctor.countDocuments({}),
      Patient.aggregate([
        { $unwind: '$consultations' },
        { $match: { 'consultations.status': 'active' } },
        { $count: 'total' }
      ])
    ]);

    const normalize = (str) => (str || '').trim().toLowerCase();

    // Unique hospitals
    const uniqueHospitals = new Set(adminHospitals.map(h => normalize(h.hospital)).filter(Boolean));
    // Unique districts
    const uniqueDistricts = new Set(adminHospitals.map(h => normalize(h.district)).filter(Boolean));
    // Unique states
    const uniqueStates = new Set(adminHospitals.map(h => normalize(h.state)).filter(Boolean));

    const totalActiveCases = activeConsultations[0]?.total || 0;

    return {
      totalPatients: patientCount,
      totalHospitals: uniqueHospitals.size || adminHospitals.length,
      totalDoctors: doctorCount,
      totalDistricts: uniqueDistricts.size || 1,
      totalStates: uniqueStates.size || 1,
      totalActiveCases,
      surveillanceStatus: '24/7 Live'
    };
  }

  // Me / Verify Session
  async getCurrentUser(user) {
    if (!user) return null;
    return sanitizeUser(user);
  }
}

module.exports = new AuthService();

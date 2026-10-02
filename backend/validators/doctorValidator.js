/**
 * Doctor Input Validators
 */

const validatePrescription = (req, res, next) => {
  const { patientId, medicines } = req.body;

  if (!patientId) {
    return res.status(400).json({
      success: false,
      message: 'Patient ID is required to generate a prescription.'
    });
  }

  if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one medicine with name, dosage, and duration is required.'
    });
  }

  const validMedicines = medicines.filter(
    (m) => (m.name || m.medicineName) && m.dosage && m.duration
  );

  if (validMedicines.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Each medicine entry must include medicine name, dosage, and duration.'
    });
  }

  req.validMedicines = validMedicines;
  next();
};

const validateDoctorProfileUpdate = (req, res, next) => {
  const { name, email, phone, specialization, qualification, experience } = req.body;

  if (!name || !email || !phone || !specialization || !qualification || experience === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, phone, specialization, qualification, and experience are required.'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  next();
};

module.exports = {
  validatePrescription,
  validateDoctorProfileUpdate
};

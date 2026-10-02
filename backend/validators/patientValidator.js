/**
 * Patient Input Validators
 */

const validateAadhaarCheck = (req, res, next) => {
  const aadhar = (req.body.aadhar || req.query.aadhar || '').toString().trim();

  if (!aadhar) {
    return res.status(400).json({
      success: false,
      message: 'Aadhaar number is required.'
    });
  }

  if (!/^\d{12}$/.test(aadhar)) {
    return res.status(400).json({
      success: false,
      message: 'Aadhaar must be exactly 12 numerical digits.'
    });
  }

  req.validatedAadhar = aadhar;
  next();
};

const validateAdminNewPatient = (req, res, next) => {
  const { name, age, aadhar, disease, doctorId, password } = req.body;

  if (!name || !age || !aadhar || !disease || !doctorId) {
    return res.status(400).json({
      success: false,
      message: 'Name, age, Aadhaar, disease/symptoms, and doctor assignment are required.'
    });
  }

  const cleanAadhar = aadhar.toString().trim();
  if (!/^\d{12}$/.test(cleanAadhar)) {
    return res.status(400).json({
      success: false,
      message: 'Aadhaar must be exactly 12 numerical digits.'
    });
  }

  req.body.aadhar = cleanAadhar;
  next();
};

const validateAssignDoctor = (req, res, next) => {
  const { doctorId } = req.body;

  if (!doctorId) {
    return res.status(400).json({
      success: false,
      message: 'Doctor ID is required to assign or schedule a consultation.'
    });
  }

  next();
};

module.exports = {
  validateAadhaarCheck,
  validateAdminNewPatient,
  validateAssignDoctor
};

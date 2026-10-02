/**
 * Authentication Input Validators
 */

const validateAdminRegister = (req, res, next) => {
  const { name, email, phone, district, state, hospital, username, password } = req.body;

  if (!name || !email || !phone || !district || !state || !hospital || !username || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields (name, email, phone, district, state, hospital, username, password) are required.'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters.'
    });
  }

  next();
};

const validateSuperAdminRegister = (req, res, next) => {
  const { name, email, phone, username, password } = req.body;

  if (!name || !email || !phone || !username || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields (name, email, phone, username, password) are required.'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters.'
    });
  }

  next();
};

const validatePatientRegister = (req, res, next) => {
  const { name, age, username, disease, district, state, hospital, password } = req.body;

  if (!name || !age || !username || !disease || !district || !state || !hospital || !password) {
    return res.status(400).json({
      success: false,
      message: 'All required fields (name, age, username, disease, district, state, hospital, password) must be provided.'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters.'
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required.'
    });
  }

  next();
};

module.exports = {
  validateAdminRegister,
  validateSuperAdminRegister,
  validatePatientRegister,
  validateLogin
};

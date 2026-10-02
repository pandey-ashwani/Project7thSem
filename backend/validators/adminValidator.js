/**
 * Admin Input Validators
 */

const validateAddDoctor = (req, res, next) => {
  const { name, email, phone, specialization, experience, qualification, username, password } = req.body;

  if (!name || !email || !phone || !specialization || experience === undefined || !qualification || !username || !password) {
    return res.status(400).json({
      success: false,
      message: 'All doctor fields (name, email, phone, specialization, experience, qualification, username, password) are required.'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid doctor email address.'
    });
  }

  next();
};

module.exports = {
  validateAddDoctor
};

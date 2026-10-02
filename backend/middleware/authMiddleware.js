const jwt = require('jsonwebtoken');
const { Admin, Doctor, Patient, SuperAdmin } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'SwasthyaSankalpSecureSecret2026';

/**
 * Authentication Middleware
 * Validates JWT token from Bearer header (or session fallback)
 * and attaches authenticated user to req.user.
 */
const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    // Fallback to passport session if session-based request exists
    if (!token && req.isAuthenticated && req.isAuthenticated() && req.user) {
      return next();
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied: Authentication token required.'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Session expired. Please log in again.'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token.'
      });
    }

    const { id, role } = decoded;
    let user = null;

    if (role === 'admin' || role === 'Admin') {
      user = await Admin.findById(id);
    } else if (role === 'doctor' || role === 'Doctor') {
      user = await Doctor.findById(id);
    } else if (role === 'superAdmin' || role === 'superadmin' || role === 'SuperAdmin') {
      user = await SuperAdmin.findById(id);
    } else if (role === 'patient' || role === 'Patient') {
      user = await Patient.findById(id);
    }

    // Fallback across models if role was undefined
    if (!user) {
      user = (await Admin.findById(id)) ||
             (await Doctor.findById(id)) ||
             (await SuperAdmin.findById(id)) ||
             (await Patient.findById(id));
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists.'
      });
    }

    req.user = user;
    req.userRole = user.role || role;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication verification failed.'
    });
  }
};

module.exports = {
  authenticate,
  JWT_SECRET
};

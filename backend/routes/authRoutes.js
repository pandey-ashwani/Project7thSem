const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  validateAdminRegister,
  validateSuperAdminRegister,
  validatePatientRegister,
  validateLogin
} = require('../validators/authValidator');
const { authenticate } = require('../middleware/authMiddleware');

// Admin Auth
router.post('/register-admin', validateAdminRegister, (req, res, next) => authController.registerAdmin(req, res, next));
router.post('/login-admin', validateLogin, (req, res, next) => authController.loginAdmin(req, res, next));

// Doctor Auth (Doctor registration is performed by Hospital Admin)
router.post('/login-doctor', validateLogin, (req, res, next) => authController.loginDoctor(req, res, next));

// Public Hospitals Directory (Grouped & Sorted by State)
router.get('/hospitals', (req, res, next) => authController.getHospitals(req, res, next));

// Public Live System Stats (Database Dynamic)
router.get('/stats', (req, res, next) => authController.getStats(req, res, next));

// Patient Auth
router.post('/register-patient', validatePatientRegister, (req, res, next) => authController.registerPatient(req, res, next));
router.post('/login-patient', validateLogin, (req, res, next) => authController.loginPatient(req, res, next));

// SuperAdmin Auth
router.post('/register-superadmin', validateSuperAdminRegister, (req, res, next) => authController.registerSuperAdmin(req, res, next));
router.post('/login-superadmin', validateLogin, (req, res, next) => authController.loginSuperAdmin(req, res, next));

// Session Verification & Logout
router.get('/me', (req, res, next) => {
  // If authorization header or session exists, authenticate first
  if (req.headers.authorization || (req.session && req.session.passport)) {
    return authenticate(req, res, () => authController.getMe(req, res, next));
  }
  return authController.getMe(req, res, next);
});

router.post('/logout', (req, res, next) => authController.logout(req, res, next));

module.exports = router;

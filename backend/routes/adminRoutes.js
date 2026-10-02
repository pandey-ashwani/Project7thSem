const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const {
  validateAadhaarCheck,
  validateAdminNewPatient,
  validateAssignDoctor
} = require('../validators/patientValidator');
const { validateAddDoctor } = require('../validators/adminValidator');

// Apply authentication and Admin role enforcement to all admin routes
router.use(authenticate);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', (req, res, next) => adminController.getDashboard(req, res, next));

// Patient Verification by Aadhaar
router.get('/check-patient', validateAadhaarCheck, (req, res, next) => adminController.checkPatient(req, res, next));
router.post('/check-patient', validateAadhaarCheck, (req, res, next) => adminController.checkPatient(req, res, next));

// Patient Registration
router.post('/new-patient', validateAdminNewPatient, (req, res, next) => adminController.registerPatient(req, res, next));
router.post('/patients', validateAdminNewPatient, (req, res, next) => adminController.registerPatient(req, res, next));

// Patient Management
router.get('/patients', (req, res, next) => adminController.getPatients(req, res, next));
router.get('/patients/:id', (req, res, next) => adminController.getPatientById(req, res, next));
router.get('/patient/:id', (req, res, next) => adminController.getPatientById(req, res, next));

// Doctor Assignment & Consultation Workflow
router.post('/assign-doctor', validateAssignDoctor, (req, res, next) => adminController.assignDoctor(req, res, next));
router.post('/assign-doctor/:id', validateAssignDoctor, (req, res, next) => adminController.assignDoctor(req, res, next));
router.post('/end-consultation/:id', (req, res, next) => adminController.endConsultation(req, res, next));

// Doctor Management
router.get('/doctors', (req, res, next) => adminController.getDoctors(req, res, next));
router.post('/doctors', validateAddDoctor, (req, res, next) => adminController.addDoctor(req, res, next));
router.post('/add-doctor', validateAddDoctor, (req, res, next) => adminController.addDoctor(req, res, next));
router.get('/doctors/:id', (req, res, next) => adminController.getDoctorById(req, res, next));
router.get('/doctor/:id', (req, res, next) => adminController.getDoctorById(req, res, next));

// Admin Profile
router.get('/profile', (req, res, next) => adminController.getProfile(req, res, next));

module.exports = router;

const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireDoctor } = require('../middleware/roleMiddleware');
const {
  validatePrescription,
  validateDoctorProfileUpdate
} = require('../validators/doctorValidator');

// Apply authentication and Doctor role enforcement to all doctor routes
router.use(authenticate);
router.use(requireDoctor);

// Clinical Dashboard
router.get('/dashboard', (req, res, next) => doctorController.getDashboard(req, res, next));

// Appointments
router.get('/appointments/today', (req, res, next) => doctorController.getTodayAppointments(req, res, next));
router.get('/today', (req, res, next) => doctorController.getTodayAppointments(req, res, next));

router.get('/appointments/upcoming', (req, res, next) => doctorController.getUpcomingAppointments(req, res, next));
router.get('/upcoming', (req, res, next) => doctorController.getUpcomingAppointments(req, res, next));

// Patient Records & History
router.get('/patient-history', (req, res, next) => doctorController.getPatientHistory(req, res, next));
router.get('/patients/history', (req, res, next) => doctorController.getPatientHistory(req, res, next));

router.get('/patient/:id', (req, res, next) => doctorController.getPatientDetails(req, res, next));
router.get('/patients/:id', (req, res, next) => doctorController.getPatientDetails(req, res, next));

// Prescriptions
router.post('/prescription', validatePrescription, (req, res, next) => doctorController.createPrescription(req, res, next));
router.post('/prescriptions', validatePrescription, (req, res, next) => doctorController.createPrescription(req, res, next));

// Doctor Profile
router.get('/profile', (req, res, next) => doctorController.getProfile(req, res, next));
router.put('/profile', validateDoctorProfileUpdate, (req, res, next) => doctorController.updateProfile(req, res, next));
router.post('/profile/update', validateDoctorProfileUpdate, (req, res, next) => doctorController.updateProfile(req, res, next));

module.exports = router;

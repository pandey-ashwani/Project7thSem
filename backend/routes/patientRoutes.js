const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticate } = require('../middleware/authMiddleware');
const { requirePatient } = require('../middleware/roleMiddleware');

// Apply authentication and Patient role enforcement to all patient routes
router.use(authenticate);
router.use(requirePatient);

// Patient Dashboard Overview
router.get('/dashboard', (req, res, next) => patientController.getDashboard(req, res, next));

// Full Medical Records & Prescriptions
router.get('/records', (req, res, next) => patientController.getRecords(req, res, next));

// Patient Profile
router.get('/profile', (req, res, next) => patientController.getProfile(req, res, next));

// Acknowledge Doctor Assignment Notification
router.post('/acknowledge-assignment', (req, res, next) => patientController.acknowledgeAssignment(req, res, next));

module.exports = router;

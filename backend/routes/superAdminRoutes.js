const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireSuperAdmin } = require('../middleware/roleMiddleware');
const { validatePolicy } = require('../validators/superAdminValidator');

// Apply authentication and SuperAdmin role enforcement
router.use(authenticate);
router.use(requireSuperAdmin);

// Analytics & Public Health Surveillance Metrics
router.get('/analytics', (req, res, next) => superAdminController.getAnalytics(req, res, next));
router.get('/dashboard', (req, res, next) => superAdminController.getAnalytics(req, res, next));
router.get('/metrics', (req, res, next) => superAdminController.getAnalytics(req, res, next));

// Statewide Data
router.get('/patients', (req, res, next) => superAdminController.getPatients(req, res, next));
router.get('/doctors', (req, res, next) => superAdminController.getDoctors(req, res, next));
router.get('/hospitals', (req, res, next) => superAdminController.getHospitals(req, res, next));

// Health Policies Governance CRUD
router.get('/policies', (req, res, next) => superAdminController.getPolicies(req, res, next));
router.post('/policies', validatePolicy, (req, res, next) => superAdminController.createPolicy(req, res, next));
router.put('/policies/:id', validatePolicy, (req, res, next) => superAdminController.updatePolicy(req, res, next));
router.delete('/policies/:id', (req, res, next) => superAdminController.deletePolicy(req, res, next));

// SuperAdmin Profile
router.get('/profile', (req, res, next) => superAdminController.getProfile(req, res, next));

module.exports = router;

const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/response');

class AuthController {
  // Admin Register
  async registerAdmin(req, res, next) {
    try {
      const result = await authService.registerAdmin(req.body);
      return successResponse(res, 'Admin registered successfully!', result, 201);
    } catch (err) {
      next(err);
    }
  }

  // Admin Login
  async loginAdmin(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await authService.loginAdmin(username, password);
      return successResponse(res, 'Admin logged in successfully!', result, 200);
    } catch (err) {
      next(err);
    }
  }

  // Doctor Login
  async loginDoctor(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await authService.loginDoctor(username, password);
      return successResponse(res, 'Doctor logged in successfully!', result, 200);
    } catch (err) {
      next(err);
    }
  }

  // Patient Register
  async registerPatient(req, res, next) {
    try {
      const result = await authService.registerPatient(req.body);
      return successResponse(res, 'Patient registered successfully!', result, 201);
    } catch (err) {
      next(err);
    }
  }

  // Patient Login
  async loginPatient(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await authService.loginPatient(username, password);
      return successResponse(res, 'Patient logged in successfully!', result, 200);
    } catch (err) {
      next(err);
    }
  }

  // SuperAdmin Register
  async registerSuperAdmin(req, res, next) {
    try {
      const result = await authService.registerSuperAdmin(req.body);
      return successResponse(res, 'SuperAdmin registered successfully!', result, 201);
    } catch (err) {
      next(err);
    }
  }

  // SuperAdmin Login
  async loginSuperAdmin(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await authService.loginSuperAdmin(username, password);
      return successResponse(res, 'SuperAdmin logged in successfully!', result, 200);
    } catch (err) {
      next(err);
    }
  }

  // Get Current Authenticated User (/api/auth/me)
  async getMe(req, res, next) {
    try {
      if (!req.user) {
        return successResponse(res, 'No active session', { authenticated: false, user: null }, 200);
      }
      const sanitized = await authService.getCurrentUser(req.user);
      return successResponse(res, 'User session verified', { authenticated: true, user: sanitized }, 200);
    } catch (err) {
      next(err);
    }
  }

  // Logout
  async logout(req, res, next) {
    try {
      if (typeof req.logout === 'function') {
        req.logout((err) => {
          if (err) console.error('Passport logout error:', err);
          if (req.session) {
            req.session.destroy(() => {});
          }
        });
      } else if (req.session) {
        req.session.destroy(() => {});
      }
      return successResponse(res, 'Logged out successfully.', null, 200);
    } catch (err) {
      next(err);
    }
  }

  // Get Public Hospitals Directory
  async getHospitals(req, res, next) {
    try {
      const result = await authService.getHospitalsDirectory();
      return successResponse(res, 'Hospitals directory fetched successfully', result, 200);
    } catch (err) {
      next(err);
    }
  }

  // Get Public Live System Stats
  async getStats(req, res, next) {
    try {
      const result = await authService.getPublicStats();
      return successResponse(res, 'Live system statistics retrieved successfully', result, 200);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();

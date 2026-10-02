/**
 * Role-Based Authorization Middleware
 * Enforces role boundaries on protected endpoints.
 */

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Please log in to proceed.'
      });
    }

    const userRole = (req.user.role || '').toLowerCase();
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden: Requires one of [${allowedRoles.join(', ')}] role.`
      });
    }

    next();
  };
};

const requireAdmin = requireRole('admin');
const requireDoctor = requireRole('doctor');
const requireSuperAdmin = requireRole('superAdmin', 'superadmin');
const requirePatient = requireRole('patient');

module.exports = {
  requireRole,
  requireAdmin,
  requireDoctor,
  requireSuperAdmin,
  requirePatient
};

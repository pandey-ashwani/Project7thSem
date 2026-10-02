/**
 * Central Error Handling Middleware
 * Sanitizes errors and returns user-friendly messages.
 */

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected server error occurred.';

  // Log full error stack on server for debugging
  console.error(`[Error Handler] ${req.method} ${req.originalUrl}:`, err);

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid identifier format for resource: ${err.path || 'ID'}`;
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    message = `A record with this ${field} already exists. Please use a unique value.`;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors || {}).map((e) => e.message);
    message = errors.length > 0 ? errors.join(', ') : 'Validation error.';
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please log in again.';
  }

  return res.status(statusCode).json({
    success: false,
    message
  });
};

const notFoundHandler = (req, res, next) => {
  return res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found on this server.`
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};

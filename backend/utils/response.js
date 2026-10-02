/**
 * Standard API Response Utilities
 * Ensures consistent JSON response structure across the application.
 */

const sendResponse = (res, statusCode = 200, success = true, message = '', data = null) => {
  const response = {
    success,
    message
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

const successResponse = (res, message = 'Operation successful', data = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data);
};

const errorResponse = (res, message = 'An error occurred', statusCode = 400, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors !== null && errors !== undefined) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendResponse,
  successResponse,
  errorResponse
};

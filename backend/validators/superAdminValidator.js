/**
 * SuperAdmin Policy Input Validators
 */

const validatePolicy = (req, res, next) => {
  const { title, description, category, status } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({
      success: false,
      message: 'Policy title, description, and category are required.'
    });
  }

  const validCategories = ['Health', 'Finance', 'Infrastructure', 'Emergency', 'Other'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `Category must be one of: ${validCategories.join(', ')}`
    });
  }

  if (status && !['active', 'draft', 'archived'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be active, draft, or archived.'
    });
  }

  next();
};

module.exports = {
  validatePolicy
};

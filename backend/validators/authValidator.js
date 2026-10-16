const { ALL_ROLES } = require('../config/constants');

const validateRegister = (req, res, next) => {
  const { email, password, full_name, role, org_id } = req.body;
  const errors = [];

  if (!email || !email.includes('@') || !email.includes('.')) {
    errors.push('A valid email address is required');
  }

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!full_name || full_name.trim().length < 2) {
    errors.push('Full name must be at least 2 characters');
  }

  if (role && !ALL_ROLES.includes(role)) {
    errors.push(`Invalid role. Must be one of: ${ALL_ROLES.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors,
      },
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.trim()) {
    errors.push('Email is required');
  }
  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors,
      },
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};

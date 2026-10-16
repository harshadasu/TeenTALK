const jwt = require('jsonwebtoken');
const env = require('../config/env');
const store = require('../models/store');
const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { errorResponse } = require('../utils/response');

/**
 * Authentication Middleware
 * Validates JWT token from Authorization header (Bearer <token>)
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication token required', 401, 'AUTH_REQUIRED');
    }

    const token = authHeader.split(' ')[1];

    // If Supabase is active, optionally verify with Supabase Auth
    if (isSupabaseConfigured) {
      const { data: authData, error } = await supabase.auth.getUser(token);
      if (!error && authData?.user) {
        // Find user profile
        const user = store.users.find(u => u.auth_id === authData.user.id || u.email === authData.user.email);
        if (user) {
          if (user.is_blocked) {
            return errorResponse(res, 'Account has been suspended or blocked', 403, 'ACCOUNT_BLOCKED');
          }
          req.user = user;
          return next();
        }
      }
    }

    // Verify local JWT
    jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return errorResponse(res, 'Invalid or expired authentication token', 401, 'AUTH_INVALID_TOKEN');
      }

      const user = store.users.find(u => u.id === decoded.id);
      if (!user) {
        return errorResponse(res, 'User associated with token not found', 401, 'USER_NOT_FOUND');
      }

      if (user.is_blocked) {
        return errorResponse(res, 'Account has been suspended or blocked', 403, 'ACCOUNT_BLOCKED');
      }

      req.user = user;
      next();
    });
  } catch (err) {
    return errorResponse(res, 'Authentication failure', 401, 'AUTH_FAILED', err.message);
  }
};

/**
 * Optional Auth Middleware (for endpoints that allow anonymous access or authenticated enhancements)
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
    if (!err && decoded) {
      const user = store.users.find(u => u.id === decoded.id && !u.is_blocked);
      req.user = user || null;
    } else {
      req.user = null;
    }
    next();
  });
};

module.exports = {
  requireAuth,
  optionalAuth,
};

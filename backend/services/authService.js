const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const env = require('../config/env');
const store = require('../models/store');
const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { logAuditEvent } = require('../middleware/audit');

const sanitizeUser = (user) => {
  const { password_hash, ...safeUser } = user;
  return safeUser;
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      org_id: user.org_id,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
};

const register = async ({ email, password, full_name, role = 'teen', org_id = null }) => {
  // Check if user already exists
  const existingUser = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    const error = new Error('An account with this email already exists');
    error.statusCode = 409;
    error.code = 'USER_ALREADY_EXISTS';
    throw error;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const newUser = {
    id: uuidv4(),
    auth_id: uuidv4(),
    email: email.toLowerCase(),
    password_hash,
    full_name,
    role,
    org_id: org_id || (role === 'teen' ? '22222222-2222-2222-2222-222222222222' : null),
    is_blocked: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Persist to store
  store.users.push(newUser);

  // If Supabase configured, attempt insert
  if (isSupabaseConfigured) {
    try {
      await supabase.from('users').insert([
        {
          id: newUser.id,
          auth_id: newUser.auth_id,
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role,
          org_id: newUser.org_id,
        },
      ]);
    } catch (err) {
      console.warn('Supabase sync notice:', err.message);
    }
  }

  await logAuditEvent({
    actorId: newUser.id,
    action: 'USER_REGISTERED',
    resourceType: 'user',
    resourceId: newUser.id,
    details: { email: newUser.email, role: newUser.role },
  });

  const token = generateToken(newUser);
  return { user: sanitizeUser(newUser), token };
};

const login = async ({ email, password }) => {
  const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  if (user.is_blocked) {
    const error = new Error('This account has been deactivated. Please contact support.');
    error.statusCode = 403;
    error.code = 'ACCOUNT_BLOCKED';
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  user.last_login_at = new Date().toISOString();

  await logAuditEvent({
    actorId: user.id,
    action: 'USER_LOGIN',
    resourceType: 'user',
    resourceId: user.id,
    details: { email: user.email, role: user.role },
  });

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
};

const getProfile = async (userId) => {
  const user = store.users.find(u => u.id === userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  const org = store.organizations.find(o => o.id === user.org_id);
  return {
    ...sanitizeUser(user),
    organization: org || null,
  };
};

const updateProfile = async (userId, updates) => {
  const userIndex = store.users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  const allowedFields = ['full_name', 'phone', 'avatar_url', 'age_group', 'bio', 'preferences'];
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      store.users[userIndex][field] = updates[field];
    }
  }

  store.users[userIndex].updated_at = new Date().toISOString();

  await logAuditEvent({
    actorId: userId,
    action: 'PROFILE_UPDATED',
    resourceType: 'user',
    resourceId: userId,
  });

  return sanitizeUser(store.users[userIndex]);
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};

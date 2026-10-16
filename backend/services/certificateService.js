const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const store = require('../models/store');
const { logAuditEvent } = require('../middleware/audit');

const generateCertificate = async (user, courseId) => {
  const mod = store.teen_modules.find(m => m.id === courseId || m.slug === courseId);
  if (!mod) {
    const error = new Error('Course module not found');
    error.statusCode = 404;
    error.code = 'MODULE_NOT_FOUND';
    throw error;
  }

  // Check progress and passing score
  const progress = store.progress.find(p => p.user_id === user.id && p.module_id === mod.id);
  if (!progress || progress.status !== 'completed' || (progress.score !== undefined && progress.score < 70)) {
    const error = new Error('Certificate Ineligible: You must complete the module and achieve a passing score of at least 70% to claim your certificate.');
    error.statusCode = 400;
    error.code = 'CERTIFICATE_INELIGIBLE';
    error.details = {
      current_status: progress ? progress.status : 'not_started',
      current_score: progress ? progress.score : 0,
      required_score: 70,
    };
    throw error;
  }

  // Check if certificate already exists
  let cert = store.certificates.find(c => c.user_id === user.id && c.module_id === mod.id);
  if (cert) {
    return {
      ...cert,
      module_title: mod.title,
      student_name: user.full_name,
    };
  }

  const certificate_code = `CERT-TT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const hashString = `${user.id}:${mod.id}:${certificate_code}:${new Date().toISOString()}`;
  const verification_hash = crypto.createHash('sha256').update(hashString).digest('hex');

  cert = {
    id: uuidv4(),
    certificate_code,
    user_id: user.id,
    module_id: mod.id,
    issue_date: new Date().toISOString(),
    score: progress.score || 100,
    verification_hash,
  };

  store.certificates.push(cert);

  await logAuditEvent({
    actorId: user.id,
    action: 'CERTIFICATE_GENERATED',
    resourceType: 'certificates',
    resourceId: cert.id,
    details: { certificate_code, module_id: mod.id },
  });

  return {
    ...cert,
    module_title: mod.title,
    student_name: user.full_name,
  };
};

const verifyCertificate = async (certificateCode) => {
  const cert = store.certificates.find(c => c.certificate_code === certificateCode);
  if (!cert) {
    const error = new Error('Invalid or unverified certificate code');
    error.statusCode = 404;
    error.code = 'CERTIFICATE_INVALID';
    throw error;
  }

  const user = store.users.find(u => u.id === cert.user_id);
  const mod = store.teen_modules.find(m => m.id === cert.module_id);

  return {
    is_valid: true,
    certificate_code: cert.certificate_code,
    recipient_name: user ? user.full_name : 'Verified Student',
    course_name: mod ? mod.title : 'Safety Course',
    issue_date: cert.issue_date,
    score: cert.score,
    verification_hash: cert.verification_hash,
  };
};

module.exports = {
  generateCertificate,
  verifyCertificate,
};

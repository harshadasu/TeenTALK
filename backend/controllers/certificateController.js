const certificateService = require('../services/certificateService');
const { successResponse } = require('../utils/response');

const generateCertificate = async (req, res, next) => {
  try {
    const cert = await certificateService.generateCertificate(req.user, req.params.courseId);
    return successResponse(res, cert, 'Certificate issued successfully', 200);
  } catch (err) {
    next(err);
  }
};

const verifyCertificate = async (req, res, next) => {
  try {
    const cert = await certificateService.verifyCertificate(req.params.code);
    return successResponse(res, cert, 'Certificate verified successfully', 200);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateCertificate,
  verifyCertificate,
};

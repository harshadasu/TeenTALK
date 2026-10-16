const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { requireAuth } = require('../middleware/auth');

router.get('/generate/:courseId', requireAuth, certificateController.generateCertificate);
router.get('/verify/:code', certificateController.verifyCertificate);

module.exports = router;

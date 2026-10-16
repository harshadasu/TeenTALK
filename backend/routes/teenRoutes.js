const express = require('express');
const router = express.Router();
const teenController = require('../controllers/teenController');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { requireRoles } = require('../middleware/rbac');
const { validateProgressUpdate } = require('../validators/teenValidator');

router.get('/modules', optionalAuth, teenController.getModules);
router.get('/modules/:id', optionalAuth, teenController.getModuleById);
router.get('/scenarios', optionalAuth, teenController.getScenarios);
router.get('/scenarios/:id', optionalAuth, teenController.getScenarioById);
router.get('/progress', requireAuth, requireRoles('teen', 'adult', 'school_admin', 'super_admin'), teenController.getProgress);
router.post('/progress/update', requireAuth, requireRoles('teen'), validateProgressUpdate, teenController.updateProgress);

module.exports = router;

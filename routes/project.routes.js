const controller = require('../controllers/project.controller.js');
const preferencesController = require('../controllers/mongodb/projectPreference.controller.js');
const adminMiddleware = require('../middleware/admin.middleware');
const router = require('express').Router();

router.post('/', adminMiddleware, controller.createProject);
router.post('/preferences', adminMiddleware, preferencesController.createPreference);

router.get('/', controller.getProjects);
router.get('/preferences', preferencesController.getAllPreferences);
router.get('/:id', controller.getProjectById);
router.get('/preferences/:projectId', preferencesController.getPreferencesById);

router.put('/preferences/:projectId', adminMiddleware, preferencesController.updatePreferenceById);

router.delete('/:id', adminMiddleware, controller.deleteProject);

module.exports = router;

const controller = require('../controllers/project.controller.js');
const preferencesController = require('../controllers/mongodb/projectPreference.controller.js');
const router = require('express').Router();

router.post('/', controller.createProject);
router.post('/preferences', preferencesController.createPreference);

router.get('/', controller.getProjects);
router.get('/preferences', preferencesController.getAllPreferences);
router.get('/:id', controller.getProjectById);
router.get('/preferences/:projectId', preferencesController.getPreferencesById);

router.put('/preferences/:projectId', preferencesController.updatePreferenceById);

router.delete('/:id', controller.deleteProject);

module.exports = router;

const controller = require('../controllers/project.controller.js');
const router = require('express').Router();

router.post('/', controller.createProject);

router.get('/', controller.getProjects);
router.get('/:id', controller.getProjectById);

module.exports = router;

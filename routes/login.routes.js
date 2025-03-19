const controller = require('../controllers/template.controller.js');
const router = require('express').Router();
const loginController = require('../controllers/login.controller.js');

router.post('/login', loginController.requestLogin);

module.exports = router;
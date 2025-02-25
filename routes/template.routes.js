const controller = require('../controllers/template.controller.js')
const router = require('express').Router();

router.post('/', controller.createTemplate);

module.exports = router;
const controller = require('../controllers/refund.controller.js')
const router = require('express').Router();

router.post('/', controller.requestRefund);

router.post('/:id/authorize', controller.authRefund);

module.exports = router;
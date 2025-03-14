const controller = require('../controllers/refund.controller.js')
const router = require('express').Router();

router.post('/', controller.requestRefund);

module.exports = router;
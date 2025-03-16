const controller = require('../controllers/refund.controller.js')
const router = require('express').Router();

router.post('/', controller.requestRefund);

router.post('/:id/authorize', controller.authRefund);

router.get('/', controller.getRefunds);

router.get('/:id', controller.getRefundById);

module.exports = router;
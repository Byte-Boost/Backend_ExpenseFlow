const controller = require('../controllers/refund.controller.js')
const router = require('express').Router();

router.post('/', controller.createRefund);
router.post('/expense', controller.createExpense);

router.patch('/:id/close', controller.closeRefund);
router.patch('/:id/authorize', controller.authRefund);

router.get('/', controller.getRefunds);
router.get('/:id', controller.getRefundById);
router.get('/expense/:id', controller.getExpenseById);

module.exports = router;
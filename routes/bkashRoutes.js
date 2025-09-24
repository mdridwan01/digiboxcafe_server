const express = require('express');
const { createPayment } = require('../controllers/bkashController');
const middleware = require('../middleware/middleware');
const bkashController = require('../controllers/bkashController');

const router = express.Router();

router.post('/bkash/create-payment', middleware.bkash_auth, bkashController.createPayment);
router.get('/bkash/payment/callback', middleware.bkash_auth, bkashController.call_back);

module.exports = router;

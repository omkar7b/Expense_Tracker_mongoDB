const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const authenticatemiddleware = require('../middleware/auth');
const {purchasePremium, updateTransactiontransactionStatus, showPremium } = require('../controllers/purchase');

router.get('/premiummembership', authenticatemiddleware.authenticate, purchasePremium);
router.post('/updatetransactiontransactionStatus',authenticatemiddleware.authenticate, updateTransactiontransactionStatus);
router.get('/ispremium', authenticatemiddleware.authenticate, showPremium);

module.exports = router;
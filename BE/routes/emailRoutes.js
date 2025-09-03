const express = require('express');
const router = express.Router();
const { sendBillEmail } = require('../controllers/emailController');

// Route for sending bill via email
router.post('/email/send-bill', sendBillEmail);

module.exports = router;

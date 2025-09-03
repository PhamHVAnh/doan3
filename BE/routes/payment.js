const express = require("express");
const router = express.Router();
const payment = require("../controllers/payment");

router.post("/payment/create_payment_url", payment);

module.exports = router;
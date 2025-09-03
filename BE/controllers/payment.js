const { VNPay, ignoreLogger, ProductCode } = require("vnpay");

async function payment(req, res) {
  try {
    const { sotien } = req.body;
    const vnpay = new VNPay({
      tmnCode: process.env.VNP_TmnCode,
      secureSecret: process.env.VNP_HashSecret,

      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      hashAlgorithm: "SHA512",
      loggerFn: ignoreLogger,
    });

    const a = Math.random().toString(36).slice(2);
    const paymentUrl = await vnpay.buildPaymentUrl({
      //
      vnp_Amount: sotien,
      vnp_OrderInfo: "Thanh toan don hang",
      vnp_TxnRef: a,
      vnp_IpAddr: "127.0.0.1",
      vnp_ReturnUrl: "http://localhost:3000/thanh-toan",
    });

    return res.status(200).json({ paymentUrl });
  } catch (error) {
    console.error("Payment error:", error);
    return res.status(500).json({ error: "Lỗi khi tạo URL thanh toán" });
  }
}

module.exports = payment;

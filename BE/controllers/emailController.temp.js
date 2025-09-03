const nodemailer = require('nodemailer');
require('dotenv').config();

// Hàm tạo transporter để gửi email
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Missing EMAIL_USER or EMAIL_PASSWORD in environment variables');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const sendBillEmail = async (req, res) => {
  try {
    const { emailTo, billHtml, orderId } = req.body;

    if (!emailTo || !billHtml || !orderId) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'emailTo, billHtml, and orderId are required'
      });
    }

    const transporter = createTransporter();
    await transporter.verify();


    // Add CSS styles to format the bill HTML
    const styledBillHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #2c3e50;">HÓA ĐƠN MUA HÀNG</h2>
          <h3 style="color: #34495e;">VAWATCH - Đồng hồ chính hãng</h3>
        </div>

        <div style="line-height: 1.6;">
          ${billHtml}
        </div>


      </div>
    `;

    const mailOptions = {
      from: `"VAWATCH Store" <${process.env.EMAIL_USER}>`,
      to: emailTo,
      subject: 'Hoá đơn mua hàng từ VAWATCH',
      html: styledBillHtml
    };

    const result = await transporter.sendMail(mailOptions);


    res.status(200).json({ 
      message: 'Email sent successfully',
      messageId: result.messageId 
    });
  } catch (error) {

    res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
};

module.exports = {
  sendBillEmail
};

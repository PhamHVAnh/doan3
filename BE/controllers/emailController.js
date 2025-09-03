const nodemailer = require('nodemailer');
const fs = require('fs');
const { generatePDF } = require('../utils/pdfGenerator');
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

    // Generate PDF

    const pdfPath = await generatePDF(billHtml, orderId);

    const transporter = createTransporter();
    await transporter.verify();


    // Email content with better formatting
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50; text-align: center;">Cảm ơn quý khách đã mua hàng tại VAWATCH</h2>
        <p>Kính gửi Quý khách,</p>
        <p>Cảm ơn Quý khách đã tin tưởng và mua sắm tại VAWATCH. Chúng tôi đã đính kèm hóa đơn chi tiết trong file PDF.</p>
        <p>Nếu Quý khách cần hỗ trợ thêm, vui lòng liên hệ:</p>
        <ul>
          <li>Hotline: 0123.456.789</li>
          <li>Email: contact@vietanhwatch.com</li>
          <li>Địa chỉ: 97 Đường Man Thiện, Hiệp Phú, TP.Thủ Đức</li>
        </ul>
        <p>Trân trọng,<br>VAWATCH Team</p>
      </div>
    `;

    const mailOptions = {
      from: `"VAWATCH Store" <${process.env.EMAIL_USER}>`,
      to: emailTo,
      subject: 'Hoá đơn mua hàng từ VAWATCH',
      html: emailContent,
      attachments: [{
        filename: `hoa-don-${orderId}.pdf`,
        path: pdfPath,
        contentType: 'application/pdf'
      }]
    };


    const result = await transporter.sendMail(mailOptions);   
    
    // Clean up - delete the temporary PDF file
    try {
      fs.unlinkSync(pdfPath);
    } catch (unlinkError) {

      // Don't throw error for cleanup failure
    }

    res.status(200).json({ 
      message: 'Email sent successfully',
      messageId: result.messageId 
    });
  } catch (error) {
    console.error('Email sending failed:', error.message);
    res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
};

module.exports = {
  sendBillEmail
};

const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');

const generatePDF = async (billHtml, orderId) => {
  const options = {
    format: 'A4',
    border: {
      top: '1cm',
      right: '1cm',
      bottom: '1cm',
      left: '1cm'
    },
    timeout: 30000,
    footer: {
      height: '20mm',
      contents: {
        default: '<div style="text-align: center; font-size: 12px;">Trang {{page}} / {{pages}} - VAWATCH</div>'
      }
    }
  };

const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; }
      </style>
    </head>
    <body>
      <div class="bill-wrapper">
        <div class="bill-header">
          <h2>HÓA ĐƠN MUA HÀNG</h2>
          <p>VAWATCH - Đồng hồ chính hãng</p>
        </div>
        <div class="bill-content">
        
          ${billHtml}
        </div>
  
      </div>
    </body>
  </html>
`;


  const pdfPath = path.join(__dirname, '../temp', `bill-${orderId}.pdf`);
  
  // Ensure temp directory exists
  const tempDir = path.join(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    pdf.create(htmlContent, options).toFile(pdfPath, (err, res) => {
      if (err) return reject(err);
      resolve(res.filename);
    });
  });
};

module.exports = {
  generatePDF
};

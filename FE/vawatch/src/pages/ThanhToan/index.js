'use client'

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "./thanhToan.scss";
import { Button } from "bootstrap";
import { toast } from 'react-toastify';

// Hàm giải mã JWT lấy payload
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// async function payment(price) {
//    console.log("Đang gửi số tiền:", price);
//   const res = await fetch(
//     "http://localhost:3002/api/payment/create_payment_url",
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ sotien: price }),
//     }
//   );
//   const data = await res.json();
//   if (data.paymentUrl) {
//     window.location.href = data.paymentUrl;
//   } else {
//     toast.error("Có lỗi xảy ra khi tạo URL thanh toán");
//   }

// }
async function payment(price) {
  const res = await fetch(
    "http://localhost:3002/api/payment/create_payment_url",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sotien: price }),
    }
  );
  const data = await res.json();
    console.log("🔗 Link thanh toán VNPay:", data.paymentUrl);
  window.location.href = (data.paymentUrl);

}
function ThanhToan() {
  const [searchParams] = useSearchParams();
  const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [method, setMethod] = useState('ViDienTu')
  const taiKhoan = localStorage.getItem("taiKhoan");
  const cartKey = taiKhoan ? `gioHang_${taiKhoan}` : "gioHang_tam";

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCartItems(storedCart);
  }, [cartKey]);
  const token = localStorage.getItem("token");
  const decoded = parseJwt(token);
  const userId = decoded?.maND;

  // State form data
  const [formData, setFormData] = useState({
    tenND: "",
    sdt: "",
    diaChi: "",
    email: "",
    ngaySinh: "",
    ghiChu: "",
    maGiamGia: "",
    phuongThucThanhToan: "COD",
  });

  const [giamGia, setGiamGia] = useState(0);
  const [pay, setPay] = useState(0);

  const [daDongY, setDaDongY] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1); 


  // Nếu chưa đăng nhập thì chuyển hướng
  useEffect(() => {
    if (!token || !userId) {
      toast.warning("Bạn cần đăng nhập để thanh toán!");
      navigate("/dang-nhap");
    }
  }, [token, userId, navigate]);
  useEffect(() => {
    const shouldProcess =
      method === 'ViDienTu' &&
      vnp_ResponseCode === '00' &&
      formData.tenND &&
      formData.sdt &&
      formData.diaChi;
  
    if (!shouldProcess) return;
  
    const handleOrder = async () => {
      setPay(tongThanhToan);
      setActiveStep(3);
      setIsLoading(true);
  
      // 1. Cập nhật người dùng
      const capNhatThanhCong = await capNhatNguoiDung();
      if (!capNhatThanhCong) {
        setIsLoading(false);
        return;
      }
  
      // 2. Tạo đơn hàng
      const donHang = {
        ngayBan: new Date().toISOString().split("T")[0],
        trangThai: "Chờ xử lý",
        giamGia: giamGia || 0,
        tongTien: tongThanhToan,
        phuongThuc: formData.phuongThucThanhToan,
        maND: userId,
        CTHoaDonBans: cartItems.map((item) => ({
          ma_CTHDB: null,
          maSP: item.maSP,
          soLuong: item.quantity,
          donGia: item.giaTien,
          thanhTien: item.giaTien * item.quantity,
        })),
      };
  
      try {
        const res = await fetch("http://localhost:3002/api/hoadonban/insert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(donHang),
        });
  
        if (!res.ok) {
          const data = await res.json();
          toast.error("Đặt hàng thất bại: " + (data.error || data.message));
          setIsLoading(false);
          return;
        }
  
        const newOrder = await res.json();
  
        // 3. Chuẩn bị nội dung gửi email
        const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            @page {
              size: A4;
              margin: 2cm;
            }
            body {
              width: 210mm;
              margin: 0 auto;
              padding: 0;
              font-family: Arial, sans-serif;
              font-size: 12pt;
              line-height: 1.3;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 8px;
              border: 1px solid #dee2e6;
            }
            th {
              background-color: #f8f9fa;
              text-align: center;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .product-image {
              width: 60px;
              height: 60px;
              object-fit: cover;
              border-radius: 4px;
              vertical-align: middle;
            }
            .info-table {
              width: 100%;
              border-collapse: collapse;
            }
            .info-table td {
              border: none;
              padding: 8px;
            }
            .payment-table {
              width: 100%;
              border: none;
            }
            .payment-table td {
              border: none;
              padding: 5px 0;
            }
            .payment-table td:last-child {
              text-align: right;
            }
            .payment-total {
              color: #dc3545;
              font-weight: bold;
            }
            .signature-section {
              margin-top: 50px;
              text-align: center;
            }
            .signature-section table {
              border: none;
              width: 100%;
            }
            .signature-section td {
              border: none;
              width: 50%;
              text-align: center;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              border-top: 1px solid #dee2e6;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="color: #2c3e50; margin: 0; font-size: 24pt;">VAWATCH</h2>
            <h3 style="color: #34495e; margin: 10px 0; font-size: 18pt;">XÁC NHẬN ĐƠN HÀNG</h3>
            <p style="margin: 5px 0;">Địa chỉ: 97 Đường Man Thiện, Hiệp Phú, TP.Thủ Đức</p>
            <p style="margin: 5px 0;">Hotline: 0123.456.789 | Email: contact@vawatch.com</p>
          </div>
      
          <table class="info-table" style="margin-bottom: 20px;">
            <tr>
              <td style="width: 50%; vertical-align: top; padding: 10px;">
                <h4 style="color: #2c3e50; margin: 0 0 10px 0;">Thông tin người nhận</h4>
                <p><strong>Họ tên:</strong> ${formData.tenND}</p>
                <p><strong>SĐT:</strong> ${formData.sdt}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Địa chỉ:</strong> ${formData.diaChi}</p>
              </td>
              <td style="width: 50%; vertical-align: top; padding: 10px;">
                <h4 style="color: #2c3e50; margin: 0 0 10px 0;">Thông tin đơn hàng</h4>
                <p><strong>Mã đơn hàng:</strong> #${newOrder.maHDB}</p>
                <p><strong>Ngày đặt:</strong> ${new Date().toLocaleDateString(
              "vi-VN"
            )}</p>
                <p><strong>Phương thức:</strong> ${formData.phuongThucThanhToan}</p>
                <p><strong>Trạng thái:</strong> Chờ xử lý</p>
              </td>
            </tr>
          </table>
      
          <table>
            <thead>
              <tr>
                <th style="width: 5%;">STT</th>
                <th style="width: 15%;">Hình ảnh</th>
                <th style="width: 35%;">Sản phẩm</th>
                <th style="width: 15%;">Đơn giá</th>
                <th style="width: 10%;">Số lượng</th>
                <th style="width: 20%;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${cartItems.map((item, idx) => `
                <tr>
                  <td style="text-align: center;">${idx + 1}</td>
                  <td style="text-align: center;">
                    <img src="http://localhost:3002${item.anhSP?.[0]}" 
                         class="product-image" 
                         alt="${item.tenSP}"/>
                  </td>
                  <td>
                    <div style="font-weight: bold;">${item.tenSP}</div>
                    <div style="color: #666; font-size: 12px;">
                      ${item.moTa ? item.moTa.substring(0, 100) + '...' : ''}
                    </div>
                  </td>
                  <td style="text-align: right;">${item.giaTien.toLocaleString()}đ</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">${(item.giaTien * item.quantity).toLocaleString()}đ</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
      
          <table class="info-table" style="margin-top: 20px;">
            <tr>
              <td style="width: 60%; padding: 15px; vertical-align: top;">
                <h5 style="color: #2c3e50; margin: 0 0 10px 0;">Điều khoản & Lưu ý:</h5>
                <p style="margin: 5px 0; font-size: 11pt;">- Sản phẩm đã mua không được đổi trả nếu không có lỗi từ nhà sản xuất</p>
                <p style="margin: 5px 0; font-size: 11pt;">- Bảo hành theo quy định của từng hãng sản xuất</p>
                <p style="margin: 5px 0; font-size: 11pt;">- Quý khách vui lòng kiểm tra kỹ sản phẩm trước khi nhận hàng</p>
              </td>
              <td style="width: 40%; padding: 15px; vertical-align: top;">
                <h5 style="color: #2c3e50; margin: 0 0 10px 0;">Tổng thanh toán</h5>
                <table class="payment-table">
                  <tr>
                    <td><strong>Tạm tính:</strong></td>
                    <td>${total.toLocaleString()}đ</td>
                  </tr>
                  <tr>
                    <td><strong>Giảm giá:</strong></td>
                    <td>${giamGia}%</td>
                  </tr>
                  <tr>
                    <td><strong>Phí vận chuyển:</strong></td>
                    <td>0đ</td>
                  </tr>
                  <tr>
                    <td colspan="2"><hr style="border-top: 1px solid #dee2e6;"></td>
                  </tr>
                  <tr>
                    <td class="payment-total">Tổng cộng:</td>
                    <td class="payment-total">${tongThanhToan.toLocaleString()}đ</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
      
          <div class="signature-section">
            <table style="border: none; width: 100%;">
              <tr>
                <td style="width: 50%; border: none; text-align: center;">
                  <p style="margin: 0;"><strong>Người mua hàng</strong></p>
                  <p style="color: #666; font-style: italic;">(Ký, ghi rõ họ tên)</p>
                  <div style="height: 80px;"></div>
                </td>
                <td style="width: 50%; border: none; text-align: center;">
                  <p style="margin: 0;"><strong>Người bán hàng</strong></p>
                  <p style="color: #666; font-style: italic;">(Ký, ghi rõ họ tên)</p>
                  <div style="height: 80px;"></div>
                </td>
              </tr>
            </table>
          </div>
      
          <div style="margin-top: 30px; text-align: center; border-top: 1px solid #dee2e6; padding-top: 20px;">
            <p style="margin: 5px 0;">Cảm ơn quý khách đã tin tưởng và mua sắm tại VAWATCH!</p>
            <p style="margin: 5px 0;">Hotline: 0123.456.789 | Email: contact@vawatch.com</p>
            <p style="margin: 5px 0;">Địa chỉ: 97 Đường Man Thiện, Hiệp Phú, TP.Thủ Đức</p>
          </div>
        </body>
        </html>
      `;
  
        // 4. Gửi email nếu có
        if (formData.email) {
          await fetch("http://localhost:3002/api/email/send-bill", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              emailTo: formData.email,
              billHtml: emailTemplate,
              orderId: newOrder.maHDB,
            }),
          });
        }
  
        // 5. Xóa giỏ hàng và chuyển trang
        toast.success("Đặt hàng thành công!");
        localStorage.removeItem(`gioHang_${localStorage.getItem("taiKhoan")}`);
        localStorage.removeItem('paymentMethod');
        navigate("/thong-tin");
        // window.location.reload();
      } catch (error) {
        toast.error("Lỗi mạng khi đặt hàng: " + error.message);
        setIsLoading(false);
      }
    };
  
    handleOrder();
  }, [method, vnp_ResponseCode, formData, cartItems]);
  
  // useEffect(() => {
  //   if (cartItems.length === 0) {
  //     alert("Giỏ hàng của bạn đang trống!");
  //     navigate("/gio-hang");
  //   }
  // }, [cartItems, navigate]);

  // Lấy thông tin người dùng từ server
  useEffect(() => {
    if (!token || !userId) return;

    fetch(`http://localhost:3002/api/nguoidung/getbyid/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setFormData((prev) => ({
            ...prev,
            tenND: data.tenND || "",
            sdt: data.sdt || "",
            diaChi: data.diaChi || "",
            email: data.email || "",
            ngaySinh: data.ngaySinh || "",
            ghiChu: "",
            maGiamGia: "",
          }));
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
      });
  }, [userId, token]);

  // Tính tổng tiền và tổng thanh toán sau giảm giá
  const total = cartItems.reduce(
    (sum, item) => sum + item.giaTien * item.quantity,
    0
  );
  const tongThanhToan = total - (total * giamGia) / 100;

  // Cập nhật thông tin người dùng lên server
  const capNhatNguoiDung = async () => {
    if (!token) {
      toast.warning("Bạn chưa đăng nhập");
      return false;
    }
    if (!userId) {
      toast.error("Không lấy được ID người dùng");
      return false;
    }
    try {
      const res = await fetch("http://localhost:3002/api/nguoidung/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          maND: userId,
          tenND: formData.tenND,
          sdt: formData.sdt,
          diaChi: formData.diaChi,
          email: formData.email,
          ngaySinh: formData.ngaySinh,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error("Cập nhật thông tin người dùng thất bại: " + (data.error || data.message));
        return false;
      }

      return true;
    } catch (error) {
      toast.error("Lỗi mạng khi cập nhật người dùng: " + error.message);
      return false;
    }
  };

  // Xử lý thay đổi form input
  const handleInputChange = (e) => {
    setPay(tongThanhToan);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'phuongThucThanhToan') {
      setMethod(value);
      localStorage.setItem('paymentMethod', value);
    }
  };

  // Thêm useEffect để khôi phục phương thức thanh toán
  useEffect(() => {
    const savedMethod = localStorage.getItem('paymentMethod');
    if (savedMethod) {
      setMethod(savedMethod);
      setFormData(prev => ({ ...prev, phuongThucThanhToan: savedMethod }));
    }
  }, []);

  // Áp dụng mã giảm giá
  const handleMaGiamGia = () => {
    if (formData.maGiamGia.trim() === "") {
      toast.warning("Vui lòng nhập mã giảm giá!");
      return;
    }

    if (formData.maGiamGia.trim() === "9999") {
      setGiamGia(5);
      toast.success("Áp dụng mã giảm giá thành công! Giảm 5%");
    } else {
      setGiamGia(0);
      toast.error("Mã khuyến mãi không hợp lệ!");
    }
  };
useEffect(() => {
  setPay(tongThanhToan);
}, [tongThanhToan]);

  // Xử lý đặt hàng
  const handleThanhToan = async (e) => {
    e.preventDefault();
    if (formData.phuongThucThanhToan === 'ViDienTu') {
       console.log("Tổng tiền cần thanh toán (VNPay):", pay);
         payment(tongThanhToan);
      // payment(pay);
    } else {

      setIsLoading(true);

      // Cập nhật thông tin người dùng trước
      const capNhatThanhCong = await capNhatNguoiDung();
      if (!capNhatThanhCong) {
        setIsLoading(false);
        return;
      }

      // Tạo đối tượng đơn hàng theo cấu trúc BE yêu cầu
      const donHang = {
        ngayBan: new Date().toISOString().split("T")[0], // yyyy-mm-dd
        trangThai: "Chờ xử lý",
        giamGia: giamGia || 0,
        tongTien: tongThanhToan,
        phuongThuc: formData.phuongThucThanhToan,
        maND: userId,
        CTHoaDonBans: cartItems.map((item) => ({
          ma_CTHDB: null, // hoặc để null nếu backend tự sinh
          maSP: item.maSP,
          soLuong: item.quantity,
          donGia: item.giaTien,
          thanhTien: item.giaTien * item.quantity,
        })),
      };

      try {
        const res = await fetch("http://localhost:3002/api/hoadonban/insert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(donHang),
        });

        if (!res.ok) {
          const data = await res.json();
          toast.error("Đặt hàng thất bại: " + (data.error || data.message));
          setIsLoading(false);
          return;
        }
        const newOrder = await res.json();
        const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page {
          size: A4;
          margin: 2cm;
        }
        body {
          width: 210mm;
          margin: 0 auto;
          padding: 0;
          font-family: Arial, sans-serif;
          font-size: 12pt;
          line-height: 1.3;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 8px;
          border: 1px solid #dee2e6;
        }
        th {
          background-color: #f8f9fa;
          text-align: center;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .product-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
          vertical-align: middle;
        }
        .info-table {
          width: 100%;
          border-collapse: collapse;
        }
        .info-table td {
          border: none;
          padding: 8px;
        }
        .payment-table {
          width: 100%;
          border: none;
        }
        .payment-table td {
          border: none;
          padding: 5px 0;
        }
        .payment-table td:last-child {
          text-align: right;
        }
        .payment-total {
          color: #dc3545;
          font-weight: bold;
        }
        .signature-section {
          margin-top: 50px;
          text-align: center;
        }
        .signature-section table {
          border: none;
          width: 100%;
        }
        .signature-section td {
          border: none;
          width: 50%;
          text-align: center;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          border-top: 1px solid #dee2e6;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h2 style="color: #2c3e50; margin: 0; font-size: 24pt;">VAWATCH</h2>
        <h3 style="color: #34495e; margin: 10px 0; font-size: 18pt;">XÁC NHẬN ĐƠN HÀNG</h3>
        <p style="margin: 5px 0;">Địa chỉ: 97 Đường Man Thiện, Hiệp Phú, TP.Thủ Đức</p>
        <p style="margin: 5px 0;">Hotline: 0123.456.789 | Email: contact@vawatch.com</p>
      </div>
  
      <table class="info-table" style="margin-bottom: 20px;">
        <tr>
          <td style="width: 50%; vertical-align: top; padding: 10px;">
            <h4 style="color: #2c3e50; margin: 0 0 10px 0;">Thông tin người nhận</h4>
            <p><strong>Họ tên:</strong> ${formData.tenND}</p>
            <p><strong>SĐT:</strong> ${formData.sdt}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Địa chỉ:</strong> ${formData.diaChi}</p>
          </td>
          <td style="width: 50%; vertical-align: top; padding: 10px;">
            <h4 style="color: #2c3e50; margin: 0 0 10px 0;">Thông tin đơn hàng</h4>
            <p><strong>Mã đơn hàng:</strong> #${newOrder.maHDB}</p>
            <p><strong>Ngày đặt:</strong> ${new Date().toLocaleDateString(
          "vi-VN"
        )}</p>
            <p><strong>Phương thức:</strong> ${formData.phuongThucThanhToan}</p>
            <p><strong>Trạng thái:</strong> Chờ xử lý</p>
          </td>
        </tr>
      </table>
  
      <table>
        <thead>
          <tr>
            <th style="width: 5%;">STT</th>
            <th style="width: 15%;">Hình ảnh</th>
            <th style="width: 35%;">Sản phẩm</th>
            <th style="width: 15%;">Đơn giá</th>
            <th style="width: 10%;">Số lượng</th>
            <th style="width: 20%;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${cartItems.map((item, idx) => `
            <tr>
              <td style="text-align: center;">${idx + 1}</td>
              <td style="text-align: center;">
                <img src="http://localhost:3002${item.anhSP?.[0]}" 
                     class="product-image" 
                     alt="${item.tenSP}"/>
              </td>
              <td>
                <div style="font-weight: bold;">${item.tenSP}</div>
                <div style="color: #666; font-size: 12px;">
                  ${item.moTa ? item.moTa.substring(0, 100) + '...' : ''}
                </div>
              </td>
              <td style="text-align: right;">${item.giaTien.toLocaleString()}đ</td>
              <td style="text-align: center;">${item.quantity}</td>
              <td style="text-align: right;">${(item.giaTien * item.quantity).toLocaleString()}đ</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
  
      <table class="info-table" style="margin-top: 20px;">
        <tr>
          <td style="width: 60%; padding: 15px; vertical-align: top;">
            <h5 style="color: #2c3e50; margin: 0 0 10px 0;">Điều khoản & Lưu ý:</h5>
            <p style="margin: 5px 0; font-size: 11pt;">- Sản phẩm đã mua không được đổi trả nếu không có lỗi từ nhà sản xuất</p>
            <p style="margin: 5px 0; font-size: 11pt;">- Bảo hành theo quy định của từng hãng sản xuất</p>
            <p style="margin: 5px 0; font-size: 11pt;">- Quý khách vui lòng kiểm tra kỹ sản phẩm trước khi nhận hàng</p>
          </td>
          <td style="width: 40%; padding: 15px; vertical-align: top;">
            <h5 style="color: #2c3e50; margin: 0 0 10px 0;">Tổng thanh toán</h5>
            <table class="payment-table">
              <tr>
                <td><strong>Tạm tính:</strong></td>
                <td>${total.toLocaleString()}đ</td>
              </tr>
              <tr>
                <td><strong>Giảm giá:</strong></td>
                <td>${giamGia}%</td>
              </tr>
              <tr>
                <td><strong>Phí vận chuyển:</strong></td>
                <td>0đ</td>
              </tr>
              <tr>
                <td colspan="2"><hr style="border-top: 1px solid #dee2e6;"></td>
              </tr>
              <tr>
                <td class="payment-total">Tổng cộng:</td>
                <td class="payment-total">${tongThanhToan.toLocaleString()}đ</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
  
      <div class="signature-section">
        <table style="border: none; width: 100%;">
          <tr>
            <td style="width: 50%; border: none; text-align: center;">
              <p style="margin: 0;"><strong>Người mua hàng</strong></p>
              <p style="color: #666; font-style: italic;">(Ký, ghi rõ họ tên)</p>
              <div style="height: 80px;"></div>
            </td>
            <td style="width: 50%; border: none; text-align: center;">
              <p style="margin: 0;"><strong>Người bán hàng</strong></p>
              <p style="color: #666; font-style: italic;">(Ký, ghi rõ họ tên)</p>
              <div style="height: 80px;"></div>
            </td>
          </tr>
        </table>
      </div>
  
      <div style="margin-top: 30px; text-align: center; border-top: 1px solid #dee2e6; padding-top: 20px;">
        <p style="margin: 5px 0;">Cảm ơn quý khách đã tin tưởng và mua sắm tại VAWATCH!</p>
        <p style="margin: 5px 0;">Hotline: 0123.456.789 | Email: contact@vawatch.com</p>
        <p style="margin: 5px 0;">Địa chỉ: 97 Đường Man Thiện, Hiệp Phú, TP.Thủ Đức</p>
      </div>
    </body>
    </html>
  `;

        // Gửi email
        if (formData.email) {
          await fetch("http://localhost:3002/api/email/send-bill", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              emailTo: formData.email,
              billHtml: emailTemplate,
              orderId: newOrder.maHDB,
            }),
          });
        }

        toast.success("Đặt hàng thành công!");
        localStorage.removeItem(`gioHang_${localStorage.getItem("taiKhoan")}`);
        localStorage.removeItem('paymentMethod');
        navigate("/thong-tin");
      } catch (error) {
        toast.error("Lỗi mạng khi đặt hàng: " + error.message);
        setIsLoading(false);
      }
    }

  };

  // Hiển thị các bước thanh toán
  const renderStepIndicator = () => {
    return (
      <div className="checkout-steps">
        <div className={`step ${activeStep >= 1 ? "active" : ""}`}>
          <div className="step-number">1</div>
          <div className="step-title">Thông tin giao hàng</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${activeStep >= 2 ? "active" : ""}`}>
          <div className="step-number">2</div>
          <div className="step-title">Phương thức thanh toán</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${activeStep >= 3 ? "active" : ""}`}>
          <div className="step-number">3</div>
          <div className="step-title">Xác nhận đơn hàng</div>
        </div>
      </div>
    );
  };

  // Hiển thị nút điều hướng giữa các bước
  const renderStepNavigation = () => {
    return (
      <div className="step-navigation">
        {activeStep > 1 && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setActiveStep(activeStep - 1)}
          >
            Quay lại
          </button>
        )}

        {activeStep < 3 && (
          <button
            type="button"
            className="btn btn-primary next-step"
            onClick={() => {
              // Kiểm tra dữ liệu trước khi chuyển bước
              //todo
              if (activeStep === 1) {
                if (!formData.tenND || !formData.sdt || !formData.diaChi|| !formData.email) {
                  toast.error("Vui lòng điền đầy đủ thông tin giao hàng!");
                  return;
                }
              }
              setActiveStep(activeStep + 1);
            }}
          >
            Tiếp tục
          </button>
        )}

        {activeStep === 3 && (
          <button
            type="button"
            className="btn btn-success place-order"
            onClick={handleThanhToan}
            disabled={isLoading || !daDongY}
          >
            {isLoading ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        )}
      </div>
    );
  };

  // Hiển thị thông tin giao hàng (Bước 1)
  const renderShippingInfo = () => {
    return (
      <div className="shipping-info">
        <div className="form-group">
          <label htmlFor="tenND">
            Họ tên người nhận <span className="text-danger">*</span>
          </label>
          <input
            id="tenND"
            name="tenND"
            placeholder="Nhập họ tên người nhận hàng"
            className="form-control"
            value={formData.tenND}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="sdt">
            Số điện thoại <span className="text-danger">*</span>
          </label>
          <input
            id="sdt"
            name="sdt"
            placeholder="Nhập số điện thoại liên hệ"
            className="form-control"
            value={formData.sdt}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="diaChi">
            Địa chỉ giao hàng <span className="text-danger">*</span>
          </label>
          <input
            id="diaChi"
            name="diaChi"
            placeholder="Nhập địa chỉ giao hàng chi tiết"
            className="form-control"
            value={formData.diaChi}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email<span className="text-danger">*</span></label>
          <input
            id="email"
            name="email"
            placeholder="Nhập email để nhận thông báo đơn hàng"
            className="form-control"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ghiChu">Ghi chú</label>
          <textarea
            id="ghiChu"
            name="ghiChu"
            placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
            className="form-control"
            value={formData.ghiChu}
            onChange={handleInputChange}
            rows="3"
          />
        </div>
      </div>
    );
  };

  // Hiển thị phương thức thanh toán (Bước 2)
  const renderPaymentMethod = () => {
    return (
      <div className="payment-method">
        <h5 className="mb-4">Chọn phương thức thanh toán</h5>

        <div className="payment-options">
          <div className={`payment-option ${formData.phuongThucThanhToan === "COD" ? "active" : ""}`}>
            <input
              type="radio"
              id="cod"
              name="phuongThucThanhToan"
              value="COD"
              checked={formData.phuongThucThanhToan === "COD"}
              onChange={handleInputChange}
            />
            <label htmlFor="cod" className="payment-label">
              <div className="payment-icon">
                <i className="fas fa-truck"></i>
              </div>
              <div className="payment-info">
                <div className="payment-title">
                  Thanh toán khi nhận hàng (COD)
                </div>
                <div className="payment-desc">
                  Thanh toán bằng tiền mặt khi nhận hàng tại nhà
                </div>
              </div>
            </label>
          </div>

          <div className={`payment-option ${formData.phuongThucThanhToan === "ChuyenKhoan" ? "active" : ""}`}>
            <input
              type="radio"
              id="bank"
              name="phuongThucThanhToan"
              value="ChuyenKhoan"
              checked={formData.phuongThucThanhToan === "ChuyenKhoan"}
              onChange={handleInputChange}
            />
            <label htmlFor="bank" className="payment-label">
              <div className="payment-icon">
                <i className="fas fa-university"></i>
              </div>
              <div className="payment-info">
                <div className="payment-title">Chuyển khoản ngân hàng</div>
                <div className="payment-desc">
                  Thanh toán qua ngân hàng MBbank
                </div>
              </div>
            </label>
          </div>

          <div className={`payment-option ${formData.phuongThucThanhToan === "ViDienTu" ? "active" : ""}`}>
            <input
              type="radio"
              id="ewallet"
              name="phuongThucThanhToan"
              value="ViDienTu"
              checked={formData.phuongThucThanhToan === "ViDienTu"}
              onChange={handleInputChange}
            />
            <label htmlFor="ewallet" className="payment-label">
              <div className="payment-icon">
                <img src="https://sandbox.vnpayment.vn/paymentv2/Images/brands/logo.svg" alt="VNPay" style={{width: '40px', height: '40px'}} />
              </div>
              <div className="payment-info">
                <div className="payment-title">VNPay</div>
                <div className="payment-desc">
                  Thanh toán an toàn qua cổng thanh toán VNPay
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Hiển thị thông tin chi tiết cho phương thức thanh toán đã chọn */}
        {formData.phuongThucThanhToan === "ChuyenKhoan" && (
          <div className="payment-details bank-details">
            <h6>Thông tin chuyển khoản</h6>
            <div className="bank-info">
              <div className="bank-text">
                <div className="bank-detail-item">
                  <i className="fas fa-university"></i>
                  <span><strong>Ngân hàng:</strong> MBbank - Chi nhánh Hà Nội</span>
                </div>
                <div className="bank-detail-item">
                  <i className="fas fa-user"></i>
                  <span><strong>Chủ tài khoản:</strong> CÔNG TY TNHH VIỆT ANH WATCH</span>
                </div>
                <div className="bank-detail-item">
                  <i className="fas fa-credit-card"></i>
                  <span><strong>Số tài khoản:</strong> 92724 1616</span>
                </div>
                <div className="bank-detail-item">
                  <i className="fas fa-info-circle"></i>
                  <span><strong>Nội dung chuyển khoản:</strong> [Tên của bạn] + [SĐT]</span>
                </div>
              </div>
              <div className="bank-qr">
                <img
                  src="/IMG/qr.png"
                  alt="QR Code thanh toán"
                  className="qr-code"
                  style={{ width: "300px", height: "300px" }}
                />
                <p>Quét mã QR để thanh toán nhanh</p>
              </div>
            </div>
          </div>
        )}

        {formData.phuongThucThanhToan === "ViDienTu" && (
          <div className="payment-details vnpay-details">
            <div className="vnpay-info">
              <div className="vnpay-logo">
                <img src="https://sandbox.vnpayment.vn/paymentv2/Images/brands/logo.svg" alt="VNPay" />
              </div>
              <div className="vnpay-text">
                <p>Bạn sẽ được chuyển đến cổng thanh toán VNPay để hoàn tất giao dịch một cách an toàn.</p>
                <ul>
                  <li>Hỗ trợ tất cả ngân hàng nội địa Việt Nam</li>
                  <li>Bảo mật theo tiêu chuẩn quốc tế</li>
                  <li>Giao dịch hoàn tất trong vài giây</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Hiển thị xác nhận đơn hàng (Bước 3)
  const renderOrderConfirmation = () => {
    return (
      <div className="order-confirmation">
        <div className="confirmation-section">
          <h5>Thông tin giao hàng</h5>
          <div className="info-card">
            <p>
              <strong>Người nhận:</strong> {formData.tenND}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {formData.sdt}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {formData.diaChi}
            </p>
            {formData.email && (
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
            )}
            {formData.ghiChu && (
              <p>
                <strong>Ghi chú:</strong> {formData.ghiChu}
              </p>
            )}
          </div>
        </div>

        <div className="confirmation-section">
          <h5>Phương thức thanh toán</h5>
          <div className="info-card">
            <p>
              <strong>
                {formData.phuongThucThanhToan === "COD" &&
                  "Thanh toán khi nhận hàng (COD)"}
                {formData.phuongThucThanhToan === "ChuyenKhoan" &&
                  "Chuyển khoản ngân hàng"}
                {formData.phuongThucThanhToan === "ViDienTu" &&
                  "VNPay"}
              </strong>
            </p>
          </div>
        </div>

        <div className="confirmation-section terms-section">
          <h5>Điều khoản và điều kiện</h5>
          <div className="terms-container">
            <div className="terms-content">
              <p>
                Xin cảm ơn Quý Khách đã đặt mua sản phẩm tại Hệ Thống Đồng hồ
                Việt Anh (Việt Anh Watch) - Đại lý Ủy Quyền Chính thức tại Việt
                Nam của các thương hiệu đồng hồ danh tiếng trên thế giới.
              </p>
              <ol>
                <li>
                  <strong>Sản phẩm:</strong> Chính hãng, mới 100%, kèm bảo hành.
                </li>
                <li>
                  <strong>Giá bán:</strong> Đã gồm VAT, chưa gồm phí ship.
                </li>
                <li>
                  <strong>Thanh toán:</strong> Chuyển khoản, ví điện tử hoặc
                  COD.
                </li>
                <li>
                  <strong>Vận chuyển:</strong> Miễn phí đơn trên 1 triệu, giao
                  1–5 ngày.
                </li>
                <li>
                  <strong>Bảo hành:</strong> Theo chính sách hãng và Việt Anh
                  Watch.
                </li>
                <li>
                  <strong>Đổi trả:</strong> Trong 7 ngày nếu lỗi NSX, chưa sử
                  dụng.
                </li>
                <li>
                  <strong>Hủy đơn:</strong> Trong vòng 1 giờ sau khi đặt.
                </li>
              </ol>
            </div>
          </div>

          <div className="form-check terms-checkbox">
            <input
              className="form-check-input"
              type="checkbox"
              id="dongY"
              checked={daDongY}
              onChange={(e) => setDaDongY(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="dongY">
              Tôi đã đọc kỹ và hoàn toàn đồng ý với quy định mua hàng ở trên
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2>Thanh toán</h2>
        {renderStepIndicator()}
      </div>

      <div className="checkout-content">
        <div className="checkout-main">
          <div className="checkout-form">
            {activeStep === 1 && renderShippingInfo()}
            {activeStep === 2 && renderPaymentMethod()}
            {activeStep === 3 && renderOrderConfirmation()}

            {renderStepNavigation()}
          </div>
        </div>

        <div className="checkout-sidebar">
          <div className="order-summary">
            <h4>Tóm tắt đơn hàng</h4>

            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.maSP} className="cart-item">
                  <div className="item-image">
                    <img
                      src={`http://localhost:3002${item.anhSP[0]}`}
                      alt={item.tenSP}
                    />
                  </div>
                  <div className="item-details">
                    <h6 className="item-name">{item.tenSP}</h6>
                    <div className="item-quantity">SL: {item.quantity}</div>
                    <div className="item-price">
                      {item.giaTien.toLocaleString("vi-VN")}₫
                    </div>
                  </div>
                  <div className="item-total">
                    {(item.giaTien * item.quantity).toLocaleString("vi-VN")}₫
                  </div>
                </div>
              ))}
            </div>

            <div className="coupon-section">
              <div className="coupon-input">
                <input
                  type="text"
                  name="maGiamGia"
                  value={formData.maGiamGia}
                  placeholder="Nhập mã giảm giá"
                  onChange={handleInputChange}
                  className="form-control"
                />
                <button
                  className="btn btn-apply"
                  onClick={handleMaGiamGia}
                  type="button"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Tạm tính:</span>
                <span>{total.toLocaleString("vi-VN")}₫</span>
              </div>

              <div className="total-row discount-row">
                <span>Giảm giá:</span>
                <span>-{giamGia}%</span>
              </div>

              <div className="total-row shipping-row">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>

              <div className="total-row grand-total">
                <span>Tổng cộng:</span>
                <span className="b">
                  {tongThanhToan.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThanhToan;
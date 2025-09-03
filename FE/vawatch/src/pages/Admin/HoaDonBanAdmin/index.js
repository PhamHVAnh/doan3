import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useRef, useState } from "react";
import {
  deleteBill,
  getAllBill,
  getBillById,
  searchBill,
  updateBill,
} from "../../../services/hoaDonBanService";
import { getUserById } from "../../../services/nguoiDungService";
import { getProductById } from "../../../services/sanPhamService";
import { toast } from 'react-toastify';
import { confirmDialog } from "../../../utils/confirmDialog";

function HoaDonBanAdmin() {
  if (!localStorage.getItem("token")) {
    window.location.replace("/dang-nhap");
  }

  // const handlePrint = () => {
  //   const printContent = document.getElementById('printableBillContent');
  //   const originalContent = document.body.innerHTML;
  //   document.body.innerHTML = printContent.innerHTML;
  //   window.print();
  //   document.body.innerHTML = originalContent;
  //   window.location.reload(); // Reload to restore event handlers
  // };
  const handlePrint = () => {
  const printContent = document.getElementById('printableBillContent');
  const WindowPrt = window.open('', '');

  WindowPrt.document.write(`
    <html>
      <head>
        <title>In hóa đơn</title>
        <style>
          ${Array.from(document.querySelectorAll('style')).map(style => style.innerHTML).join('\n')}
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
    </html>
  `);

  WindowPrt.document.close();
  WindowPrt.focus();

  WindowPrt.onload = () => {
    WindowPrt.print();
    WindowPrt.close();
  };
};


const handleSendEmail = async (email) => {
  try {
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
          <h3 style="color: #34495e; margin: 10px 0; font-size: 18pt;">HOÁ ĐƠN BÁN HÀNG</h3>
          <p style="margin: 5px 0;">Địa chỉ: 97 Đường Man Thiện, Hiệp Phú, TP.Thủ Đức</p>
          <p style="margin: 5px 0;">Hotline: 0123.456.789 | Email: contact@vawatch.com</p>
        </div>

        <table class="info-table" style="margin-bottom: 20px;">
          <tr>
            <td style="width: 50%; vertical-align: top; padding: 10px;">
              <h4 style="color: #2c3e50; margin: 0 0 10px 0;">Thông tin đơn hàng</h4>
              <p><strong>Mã hoá đơn:</strong> #${selectedBill?.maHDB}</p>
              <p><strong>Ngày đặt:</strong> ${new Date(selectedBill?.ngayBan).toLocaleDateString("vi-VN")}</p>
              <p><strong>Phương thức:</strong> ${selectedBill?.phuongThuc}</p>
            </td>
            <td style="width: 50%; vertical-align: top; padding: 10px;">
              <h4 style="color: #2c3e50; margin: 0 0 10px 0;">Thông tin khách hàng</h4>
              <p><strong>Họ tên:</strong> ${users[selectedBill?.maND]?.tenND}</p>
              <p><strong>Số điện thoại:</strong> ${users[selectedBill?.maND]?.sdt}</p>
              <p><strong>Email:</strong> ${users[selectedBill?.maND]?.email}</p>
              <p><strong>Địa chỉ:</strong> ${users[selectedBill?.maND]?.diaChi}</p>
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
            ${selectedBill?.CTHoaDonBans?.map((item, idx) => `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td style="text-align: center;">
                  <img src="http://localhost:3002${products[item.maSP]?.anhSP?.[0]}" 
                       class="product-image" 
                       alt="${products[item.maSP]?.tenSP}"/>
                </td>
                <td>${products[item.maSP]?.tenSP}</td>
                <td style="text-align: right;">${item.donGia?.toLocaleString()}đ</td>
                <td style="text-align: center;">${item.soLuong}</td>
                <td style="text-align: right;">${item.thanhTien?.toLocaleString()}đ</td>
              </tr>
            `).join('')}
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
                  <td><strong>Tổng tiền hàng:</strong></td>
                  <td>${selectedBill?.tongTien?.toLocaleString()}đ</td>
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
                  <td class="payment-total">${selectedBill?.tongTien?.toLocaleString()}đ</td>
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

        <div class="footer">
          <p style="margin: 5px 0;">Cảm ơn quý khách đã tin tưởng và mua sắm tại VAWATCH!</p>
          <p style="margin: 5px 0;">Hotline: 0123.456.789 | Email: contact@vawatch.com</p>
          <p style="margin: 5px 0;">Địa chỉ: 97 Đường Man Thiện, Hiệp Phú, TP.Thủ Đức</p>
        </div>
      </body>
      </html>
    `;

    const response = await fetch('http://localhost:3002/api/email/send-bill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        emailTo: email,
        billHtml: emailTemplate,
        orderId: selectedBill.maHDB
      })
    });

    if (response.ok) {
      toast.success('Hoá đơn đã được gửi thành công qua email!');
    } else {
      throw new Error('Không thể gửi email');
    }
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    toast.error('Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.');
  }
};


  const [editingBillId, setEditingBillId] = useState(null);

  const [bills, setBills] = useState([]);
  const [users, setUsers] = useState({});
  const [products, setProducts] = useState({});
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const searchTimeoutRef = useRef(null);
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const filteredBills = filterStatus === "Tất cả"
  ? bills
  : bills.filter((bill) => bill.trangThai === filterStatus);
  const indexOfLast = currentPage * recordsPerPage;
const indexOfFirst = indexOfLast - recordsPerPage;
const currentRecords = filteredBills.slice(indexOfFirst, indexOfLast);
const totalPages = Math.ceil(filteredBills.length / recordsPerPage);

  // Fetch all bills
  const fetchAllBills = async () => {
    try {
      const data = await getAllBill();
      setBills(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách hóa đơn:", error);
    }
  };

  useEffect(() => {
    fetchAllBills();
  }, []);

  // Fetch user data
  useEffect(() => {
    const uniqueUserIds = [...new Set(bills.map((bill) => bill.maND))];
    uniqueUserIds.forEach(async (id) => {
      if (!users[id]) {
        try {
          const user = await getUserById(id);
          setUsers((prev) => ({ ...prev, [id]: user }));
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      }
    });
  }, [bills]);

  // Fetch product data
  useEffect(() => {
    bills.forEach((bill) => {
      bill.CTHoaDonBans?.forEach(async (item) => {
        const maSP = item.maSP;
        if (maSP && !products[maSP]) {
          try {
            const product = await getProductById(maSP);
            setProducts((prev) => ({ ...prev, [maSP]: product }));
          } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
          }
        }
      });
    });
  }, [bills]);

  const handleViewDetails = async (maHDB) => {
    try {
      const billDetail = await getBillById(maHDB);
      setSelectedBill(billDetail);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
    }
  };

  const handleDelete = async (maHDB) => {
    const confirmed = await confirmDialog("Bạn có chắc chắn muốn xóa hóa đơn này?");
    if (confirmed) {
      try {
        await deleteBill(maHDB);
        setBills((prev) => prev.filter((b) => b.maHDB !== maHDB));
        setSelectedBill(null);
        toast.success("Xóa hóa đơn thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa hóa đơn:", error);
        toast.error("Xóa hóa đơn thất bại!");
      }
    }
  };

  const handleChangeStatus = async (maHDB, trangThai) => {
    const confirmed = await confirmDialog(`Bạn có chắc chắn muốn ${trangThai === "Đã duyệt" ? "duyệt" : "hủy"} đơn hàng này?`);
    if (confirmed) {
      try {
        const updated = await updateBill({ maHDB, trangThai });
        setBills((prev) => prev.map((b) => (b.maHDB === maHDB ? updated : b)));
        toast.success(`${trangThai === "Đã duyệt" ? "Duyệt" : "Hủy"} đơn hàng thành công!`);
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        toast.error(`${trangThai === "Đã duyệt" ? "Duyệt" : "Hủy"} đơn hàng thất bại!`);
      }
    }
  };

  const handleSearch = async (query) => {
    try {
      if (query.trim()) {
        const data = await searchBill(query);
        setBills(data);
      } else {
        fetchAllBills();
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  };

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery]);



  return (
    <div className="container-fluid mt-3">
      <h3 className="text-center mb-4">Danh sách đơn hàng xuất</h3>

      <div className="d-flex justify-content-between mb-3">
        <div className="search-container" style={{ width: "50%" }}>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hóa đơn, khách hàng..."
              className="form-control border-start-0 ps-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                borderLeft: "none",
                boxShadow: "none",
                paddingLeft: "0"
              }}
            />
            {searchQuery && (
              <button
                className="btn btn-outline-secondary border-start-0"
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  fetchAllBills();
                }}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>
      </div>
 <div className="d-flex align-items-center mb-3 gap-3">
  <div className="d-flex align-items-center">
    <label className="me-2 fw-semibold">Hiển thị:</label>
    <select
      className="form-select w-auto"
      value={recordsPerPage}
      onChange={(e) => {
        setRecordsPerPage(Number(e.target.value));
        setCurrentPage(1);
      }}
    >
      {[5, 10, 15, 20, 100].map((num) => (
        <option key={num} value={num}>{num}</option>
      ))}
    </select>
  </div>
  <div className="d-flex align-items-center">
    <label className="me-2 fw-semibold">Trạng thái:</label>
    <select
      className="form-select w-auto"
      value={filterStatus}
      onChange={(e) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1);
      }}
    >
      <option value="Tất cả">Tất cả</option>
      <option value="Chờ duyệt">Chờ duyệt</option>
      <option value="Đã duyệt">Đã duyệt</option>
      <option value="Đã huỷ">Đã huỷ</option>
    </select>
  </div>
</div>
      <table className="table table-bordered text-center align-middle">
        <thead>
          <tr>
            <th>STT</th>
            <th>Ngày đặt</th>
            <th>Khách hàng</th>
            <th>Điện thoại</th>
            <th>Địa chỉ</th>
            <th>Email</th>
            <th>Tổng tiền</th>
            <th>Phương thức</th>
            <th>Trạng thái</th>
            <th colSpan={2}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((bill) => (
            <tr key={bill.maHDB}>
              <td>{bills.indexOf(bill) + 1}</td>
              <td>{new Date(bill.ngayBan).toLocaleDateString("vi-VN")}</td>
              <td>{users[bill.maND]?.tenND || "..."}</td>
              <td>{users[bill.maND]?.sdt}</td>
              <td>{users[bill.maND]?.diaChi}</td>
              <td>{users[bill.maND]?.email}</td>
              <td>{bill.tongTien?.toLocaleString()}đ</td>
              <td>{bill.phuongThuc}</td>
              <td>
                {editingBillId === bill.maHDB ? (
                  <select
                    className="form-select form-select-sm fw-bold text-center"
                    value={bill.trangThai}
                    onChange={(e) => {
                      handleChangeStatus(bill.maHDB, e.target.value);
                      setTimeout(() => setEditingBillId(null), 100); // Đóng select sau khi chọn, tránh mất focus quá sớm
                    }}
                    onBlur={() => setEditingBillId(null)}
                    autoFocus
                  >
                    <option value="Chờ duyệt">Chờ duyệt</option>
                    <option value="Đã duyệt">Đã duyệt</option>
                    <option value="Đã huỷ">Đã huỷ</option>
                  </select>
                ) : (
                  <span
                    className={`badge px-3 py-2 fs-9 ${
                      bill.trangThai === "Chờ duyệt"
                        ? "bg-warning text-dark"
                        : bill.trangThai === "Đã huỷ"
                        ? "bg-danger"
                        : "bg-success "
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setEditingBillId(bill.maHDB)}
                    title="Bấm để đổi trạng thái"
                  >
                    {bill.trangThai}
                  </span>
                )}
              </td>

              <td>
                <button
                  className="btn btn-outline-primary btn-sm me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#billDetailModal"
                  onClick={() => handleViewDetails(bill.maHDB)}
                >
                  <i className="fas fa-eye"></i>
                </button>
              </td>
              <td>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(bill.maHDB)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div
  className="pagination-toolbar d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 8,
  }}
>
  <nav style={{ marginLeft: "auto" }}>
    <ul
      className="pagination-container"
      style={{
        display: "flex",
        listStyle: "none",
        padding: 0,
        margin: 0,
        gap: 4,
      }}
    >
      {/* Nút về đầu trang: << */}
      {currentPage > 1 && (
        <li>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(1)}
          >
            &laquo;
          </button>
        </li>
      )}

      {/* Nút lùi 1 trang: < */}
      {currentPage > 1 && (
        <li>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &lsaquo;
          </button>
        </li>
      )}

      {/* Các số trang */}
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .slice(
          Math.max(currentPage - 3, 0),
          Math.min(currentPage + 2, totalPages)
        )
        .map((page) => (
          <li key={page}>
            <button
              className={`pagination-btn ${
                currentPage === page ? "active" : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          </li>
        ))}

      {/* Nút tới 1 trang: > */}
      {currentPage < totalPages && (
        <li>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &rsaquo;
          </button>
        </li>
      )}

      {/* Nút đến cuối trang: >> */}
      {currentPage < totalPages && (
        <li>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(totalPages)}
          >
            &raquo;
          </button>
        </li>
      )}
    </ul>
  </nav>
</div>


      {/* Modal chi tiết hóa đơn */}
      <div className="modal fade" id="billDetailModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chi tiết hóa đơn</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {/* Giao diện xem cho admin */}
              <div className="view-content">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p><strong>Mã hóa đơn:</strong> {selectedBill?.maHDB}</p>
                    <p><strong>Ngày đặt:</strong> {new Date(selectedBill?.ngayBan).toLocaleDateString("vi-VN")}</p>
                    <p><strong>Khách hàng:</strong> {users[selectedBill?.maND]?.tenND || "..."}</p>
                    <p><strong>Điện thoại:</strong> {users[selectedBill?.maND]?.sdt}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Địa chỉ:</strong> {users[selectedBill?.maND]?.diaChi}</p>
                    <p><strong>Email:</strong> {users[selectedBill?.maND]?.email}</p>
                    <p><strong>Phương thức thanh toán:</strong> {selectedBill?.phuongThuc}</p>
                    <p><strong>Trạng thái:</strong> <span className={`badge ${selectedBill?.trangThai === "Chờ duyệt" ? "bg-warning text-dark" : selectedBill?.trangThai === "Đã huỷ" ? "bg-danger" : "bg-success"}`}>{selectedBill?.trangThai}</span></p>
                  </div>
                </div>

                <h5>Sản phẩm đã mua:</h5>
                {selectedBill?.CTHoaDonBans?.length > 0 ? (
                  <div className="list-group">
                    {selectedBill.CTHoaDonBans.map((item, idx) => (
                      <div key={idx} className="list-group-item d-flex align-items-center mb-2 shadow-sm rounded">
                        <img
                          src={`http://localhost:3002${products[item.maSP]?.anhSP?.[0]}`}
                          width="80" height="90" alt="Ảnh sản phẩm" className="me-3 rounded" style={{ objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{products[item.maSP]?.tenSP}</h6>
                          <p className="mb-1">Số lượng: {item.soLuong}</p>
                          <p className="mb-1">Đơn giá: {item.donGia?.toLocaleString()}đ</p>
                          <p className="fw-bold">Thành tiền: {item.thanhTien?.toLocaleString()}đ</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center">Không có sản phẩm nào trong hóa đơn này.</p>
                )}
                <h5 className="mt-3 text-end">Tổng tiền hóa đơn: <span className="text-danger">{selectedBill?.tongTien?.toLocaleString()}đ</span></h5>
              </div>

              {/* Giao diện in ấn - ẩn mặc định */}
              <div id="printableBillContent" style={{ display: 'none' }}>
                <style>
                  {`
                    @media print {
                      #printableBillContent { display: block !important; }
                      .view-content, .modal-header, .modal-footer { display: none !important; }
                      .shadow-sm { box-shadow: none !important; }
                      @page { 
                        margin: 1cm;
                        size: A4;
                      }
                      body { 
                        font-size: 12px;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                      }
                      img { max-width: 50px !important; }
                    }
                  `}
                </style>
                <div className="text-center mb-4">
                  <h2 className="mb-1" style={{color: '#2c3e50', fontWeight: 'bold'}}>VAWATCH</h2>
                  <h4 className="mb-3" style={{color: '#34495e'}}>HOÁ ĐƠN BÁN HÀNG</h4>
                  <p className="mb-1">Địa chỉ: 97 Đường Man Thiện, Hiệp Phú, TP.Thủ Đức</p>
                  <p className="mb-1">Hotline: 0123.456.789 - Email: contact@vawatch.com</p>
                  <hr className="my-4" style={{border: '1px solid #34495e'}} />
                </div>

                <div className="row mb-4">
                  <div className="col-6">
                    <h5 className="mb-3" style={{color: '#2c3e50'}}>Thông tin đơn hàng:</h5>
                    <p><strong>Mã hoá đơn:</strong> #{selectedBill?.maHDB}</p>
                    <p><strong>Ngày đặt:</strong> {new Date(selectedBill?.ngayBan).toLocaleDateString("vi-VN")}</p>
                    {/* <p><strong>Trạng thái:</strong> <span className={`badge ${selectedBill?.trangThai === "Chờ duyệt" ? "bg-warning text-dark" : selectedBill?.trangThai === "Đã huỷ" ? "bg-danger" : "bg-success"}`}>{selectedBill?.trangThai}</span></p> */}
                    <p><strong>Phương thức thanh toán:</strong> {selectedBill?.phuongThuc}</p>
                  </div>
                  <div className="col-6">
                    <h5 className="mb-3" style={{color: '#2c3e50'}}>Thông tin khách hàng:</h5>
                    <p><strong>Họ tên:</strong> {users[selectedBill?.maND]?.tenND || "..."}</p>
                    <p><strong>Số điện thoại:</strong> {users[selectedBill?.maND]?.sdt}</p>
                    <p><strong>Email:</strong> {users[selectedBill?.maND]?.email}</p>
                    <p><strong>Địa chỉ:</strong> {users[selectedBill?.maND]?.diaChi}</p>
                  </div>
                </div>

                <h5 className="mb-3" style={{color: '#2c3e50'}}>Chi tiết sản phẩm:</h5>
                {selectedBill?.CTHoaDonBans?.length > 0 ? (
                  <div>
                    <table className="custom-table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th className="text-center">STT</th>
                          <th>Sản phẩm</th>
                          <th className="text-center">Đơn giá</th>
                          <th className="text-center">Số lượng</th>
                          <th className="text-end">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBill.CTHoaDonBans.map((item, idx) => (
                          <tr key={idx}>
                            <td className="text-center">{idx + 1}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={`http://localhost:3002${products[item.maSP]?.anhSP?.[0]}`}
                                  width="50" height="50" alt="Sản phẩm"
                                  className="me-2 rounded"
                                  style={{ objectFit: 'cover' }}
                                />
                                <span>{products[item.maSP]?.tenSP}</span>
                              </div>
                            </td>
                            <td className="text-center">{item.donGia?.toLocaleString()}đ</td>
                            <td className="text-center">{item.soLuong}</td>
                            <td className="text-end">{item.thanhTien?.toLocaleString()}đ</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center">Không có sản phẩm nào trong hóa đơn này.</p>
                )}

                <div className="row mt-4">
                  <div className="col-7">
                    <div className="border p-3 rounded">
                      <h6 className="mb-3" style={{color: '#2c3e50'}}>Điều khoản & Lưu ý:</h6>
                      <p className="mb-1 small">- Sản phẩm đã mua không được đổi trả nếu không có lỗi từ nhà sản xuất</p>
                      <p className="mb-1 small">- Bảo hành theo quy định của từng hãng sản xuất</p>
                      <p className="mb-1 small">- Quý khách vui lòng kiểm tra kỹ sản phẩm trước khi nhận hàng</p>
                    </div>
                  </div>
                  <div className="col-5">
                    <div className="border p-3 rounded">
                      <div className="d-flex justify-content-between mb-2">
                        <strong>Tổng tiền hàng:</strong>
                        <span>{selectedBill?.tongTien?.toLocaleString()}đ</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <strong>Phí vận chuyển:</strong>
                        <span>0đ</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <h6 className="mb-0">Tổng thanh toán:</h6>
                        <h6 className="mb-0 text-danger">{selectedBill?.tongTien?.toLocaleString()}đ</h6>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-4 pt-4">
                  <div className="col-6 text-center">
                    <h6>Người mua hàng</h6>
                    <p className="small text-muted">(Ký, ghi rõ họ tên)</p>
                  </div>
                  <div className="col-6 text-center">
                    <h6>Người bán hàng</h6>
                    <p className="small text-muted">(Ký, ghi rõ họ tên)</p>
                  </div>
                </div>
              </div>

              {/* Giao diện in ấn - ẩn mặc định */}
              <div id="printableBillContent" style={{ display: 'none' }}>
                <style>
                  {`
                    @media print {
                      #printableBillContent { display: block !important; }
                      .view-content, .modal-header, .modal-footer { display: none !important; }
                      .shadow-sm { box-shadow: none !important; }
                      @page { 
                        margin: 1cm;
                        size: A4;
                      }
                      body { 
                        font-size: 12px;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                      }
                      img { max-width: 50px !important; }
                    }
                  `}
                </style>
                <div className="text-center mb-4">
                  <h2 className="mb-1" style={{color: '#2c3e50', fontWeight: 'bold'}}>VAWATCH</h2>
                  <h4 className="mb-3" style={{color: '#34495e'}}>HOÁ ĐƠN BÁN HÀNG</h4>
                  <p className="mb-1">Địa chỉ: 97 Đường Man Thiện, Hiệp Phú, TP.Thủ Đức</p>
                  <p className="mb-1">Hotline: 0123.456.789 - Email: contact@vawatch.com</p>
                  <hr className="my-4" style={{border: '1px solid #34495e'}} />
                </div>

                <div className="row mb-4">
                  <div className="col-6">
                    <h5 className="mb-3" style={{color: '#2c3e50'}}>Thông tin đơn hàng:</h5>
                    <p><strong>Mã hoá đơn:</strong> #{selectedBill?.maHDB}</p>
                    <p><strong>Ngày đặt:</strong> {new Date(selectedBill?.ngayBan).toLocaleDateString("vi-VN")}</p>
                    {/* <p><strong>Trạng thái:</strong> <span className={`badge ${selectedBill?.trangThai === "Chờ duyệt" ? "bg-warning text-dark" : selectedBill?.trangThai === "Đã huỷ" ? "bg-danger" : "bg-success"}`}>{selectedBill?.trangThai}</span></p> */}
                    <p><strong>Phương thức thanh toán:</strong> {selectedBill?.phuongThuc}</p>
                  </div>
                  <div className="col-6">
                    <h5 className="mb-3" style={{color: '#2c3e50'}}>Thông tin khách hàng:</h5>
                    <p><strong>Họ tên:</strong> {users[selectedBill?.maND]?.tenND || "..."}</p>
                    <p><strong>Số điện thoại:</strong> {users[selectedBill?.maND]?.sdt}</p>
                    <p><strong>Email:</strong> {users[selectedBill?.maND]?.email}</p>
                    <p><strong>Địa chỉ:</strong> {users[selectedBill?.maND]?.diaChi}</p>
                  </div>
                </div>

                <h5 className="mb-3" style={{color: '#2c3e50'}}>Chi tiết sản phẩm:</h5>
                {selectedBill?.CTHoaDonBans?.length > 0 ? (
                  <div>
                    <table className="custom-table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th className="text-center">STT</th>
                          <th>Sản phẩm</th>
                          <th className="text-center">Đơn giá</th>
                          <th className="text-center">Số lượng</th>
                          <th className="text-end">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBill.CTHoaDonBans.map((item, idx) => (
                          <tr key={idx}>
                            <td className="text-center">{idx + 1}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={`http://localhost:3002${products[item.maSP]?.anhSP?.[0]}`}
                                  width="50" height="50" alt="Sản phẩm"
                                  className="me-2 rounded"
                                  style={{ objectFit: 'cover' }}
                                />
                                <span>{products[item.maSP]?.tenSP}</span>
                              </div>
                            </td>
                            <td className="text-center">{item.donGia?.toLocaleString()}đ</td>
                            <td className="text-center">{item.soLuong}</td>
                            <td className="text-end">{item.thanhTien?.toLocaleString()}đ</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center">Không có sản phẩm nào trong hóa đơn này.</p>
                )}

                <div className="row mt-4">
                  <div className="col-7">
                    <div className="border p-3 rounded">
                      <h6 className="mb-3" style={{color: '#2c3e50'}}>Điều khoản & Lưu ý:</h6>
                      <p className="mb-1 small">- Sản phẩm đã mua không được đổi trả nếu không có lỗi từ nhà sản xuất</p>
                      <p className="mb-1 small">- Bảo hành theo quy định của từng hãng sản xuất</p>
                      <p className="mb-1 small">- Quý khách vui lòng kiểm tra kỹ sản phẩm trước khi nhận hàng</p>
                    </div>
                  </div>
                  <div className="col-5">
                    <div className="border p-3 rounded">
                      <div className="d-flex justify-content-between mb-2">
                        <strong>Tổng tiền hàng:</strong>
                        <span>{selectedBill?.tongTien?.toLocaleString()}đ</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <strong>Phí vận chuyển:</strong>
                        <span>0đ</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <h6 className="mb-0">Tổng thanh toán:</h6>
                        <h6 className="mb-0 text-danger">{selectedBill?.tongTien?.toLocaleString()}đ</h6>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-4 pt-4">
                  <div className="col-6 text-center">
                    <h6>Người mua hàng</h6>
                    <p className="small text-muted">(Ký, ghi rõ họ tên)</p>
                  </div>
                  <div className="col-6 text-center">
                    <h6>Người bán hàng</h6>
                    <p className="small text-muted">(Ký, ghi rõ họ tên)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary me-2" onClick={handlePrint}>
                <i className="fas fa-print me-2"></i>
                In hoá đơn
              </button>
              <button className="btn btn-success me-2" onClick={() => handleSendEmail(users[selectedBill?.maND]?.email)}>
                <i className="fas fa-envelope me-2"></i>
                Gửi qua Email
              </button>
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};    

export default HoaDonBanAdmin;

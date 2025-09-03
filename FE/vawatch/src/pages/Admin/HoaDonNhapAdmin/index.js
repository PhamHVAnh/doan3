import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import { toast } from "react-toastify";
import { confirmDialog } from "../../../utils/confirmDialog";

import { useEffect, useRef, useState } from "react";

import { getAllUsers, getUserById } from "../../../services/nguoiDungService";
import {
  getAllProducts,
  getProductById,
} from "../../../services/sanPhamService";
import {
  deleteImprot,
  getAllImport,
  getImportById,
  insertImport,
  searchImprot,
} from "../../../services/hoaDonNhapService";
import {
  getAllSuppliers,
  getSupplierById,
} from "../../../services/nhaCungCapAdmin";

function HoaDonNhapAdmin() {
  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.replace("/dang-nhap");
    }
  }, []);

  // Các state chính
  const [imports, setImports] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [productsMap, setProductsMap] = useState({});
  const [suppliersMap, setSuppliersMap] = useState({});

  const [selectedImport, setSelectedImport] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  const [nguoiDung, setNguoiDung] = useState(null);

  // Form nhập mới
  const [formData, setFormData] = useState({
    maNCC: "",
    phuongThuc: "",
    giamGia: 0, // phần trăm
    CTHoaDonNhaps: [
      {
        id: Date.now(),
        maSP: "",
        soLuong: 0,
        donGia: 0,
      },
    ],
  });

  const [selectedProduct, setSelectedProduct] = useState(null);

  // Hàm định dạng số tiền
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "0";
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "0";
    return numValue.toLocaleString("vi-VN");
  };

  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString("vi-VN");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const handlePrintBill = () => {
    // Tạo iframe ẩn
    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);

    // Tạo nội dung in
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hóa đơn nhập hàng - ${selectedImport?.maHDN || ""}</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            width: 210mm;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.3;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            padding: 8px;
            border: 1px solid #dee2e6;
          }
          th {
            background-color: #f8f9fa;
            text-align: center;
          }
          .product-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <h2 style="color: #2c3e50; margin: 0; font-size: 24pt;">VAWATCH</h2>
          <h3 style="color: #34495e; margin: 10px 0; font-size: 18pt;">HÓA ĐƠN NHẬP HÀNG</h3>
          <p style="margin: 5px 0;">Địa chỉ: 97 Đường Man Thiện, Hiệp Phú, TP.Thủ Đức</p>
          <p style="margin: 5px 0;">Hotline: 0123.456.789 | Email: contact@vawatch.com</p>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div style="width: 48%; padding: 15px; border: 1px solid #dee2e6; border-radius: 8px;">
            <h4 style="color: #2c3e50; margin: 0 0 10px 0;">Thông tin hóa đơn</h4>
            <p><strong>Mã hóa đơn:</strong> #${selectedImport?.maHDN || ""}</p>
            <p><strong>Ngày nhập:</strong> ${
              selectedImport?.ngayNhap
                ? new Date(selectedImport.ngayNhap).toLocaleDateString("vi-VN")
                : ""
            }</p>
            <p><strong>Phương thức:</strong> ${
              selectedImport?.phuongThuc || ""
            }</p>
          </div>
          <div style="width: 48%; padding: 15px; border: 1px solid #dee2e6; border-radius: 8px;">
            <h4 style="color: #2c3e50; margin: 0 0 10px 0;">Thông tin nhà cung cấp</h4>
            <p><strong>Tên NCC:</strong> ${
              suppliersMap[selectedImport?.maNCC]?.tenNCC || ""
            }</p>
            <p><strong>Số điện thoại:</strong> ${
              suppliersMap[selectedImport?.maNCC]?.sdt || ""
            }</p>
            <p><strong>Email:</strong> ${
              suppliersMap[selectedImport?.maNCC]?.email || ""
            }</p>
            <p><strong>Địa chỉ:</strong> ${
              suppliersMap[selectedImport?.maNCC]?.diaChi || ""
            }</p>
          </div>
        </div>

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
            ${selectedImport?.CTHoaDonNhaps?.map(
              (item, idx) => `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td style="text-align: center;">
                  <img src="http://localhost:3002${
                    productsMap[item?.maSP]?.anhSP?.[0] || ""
                  }" 
                       class="product-image" 
                       alt="${productsMap[item?.maSP]?.tenSP || ""}"/>
                </td>
                <td>${productsMap[item?.maSP]?.tenSP || ""}</td>
                <td style="text-align: right;">${
                  item?.donGia ? item.donGia.toLocaleString("vi-VN") : "0"
                }đ</td>
                <td style="text-align: center;">${item?.soLuong || "0"}</td>
                <td style="text-align: right;">${
                  item?.thanhTien ? item.thanhTien.toLocaleString("vi-VN") : "0"
                }đ</td>
              </tr>
            `
            ).join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5" style="text-align: right;"><strong>Tổng cộng:</strong></td>
              <td style="text-align: right;"><strong>${calculateTotal(
                selectedImport
              ).toLocaleString("vi-VN")}đ</strong></td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 50px; text-align: center;">
          <table style="width: 100%; border: none;">
            <tr>
              <td style="width: 50%; border: none; text-align: center;">
                <p style="margin: 0;"><strong>Người giao hàng</strong></p>
                <p style="color: #666; font-style: italic;">(Ký, ghi rõ họ tên)</p>
                <div style="height: 80px;"></div>
              </td>
              <td style="width: 50%; border: none; text-align: center;">
                <p style="margin: 0;"><strong>Người nhận hàng</strong></p>
                <p style="color: #666; font-style: italic;">(Ký, ghi rõ họ tên)</p>
                <div style="height: 80px;"></div>
              </td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 30px; text-align: center; border-top: 1px solid #dee2e6; padding-top: 20px;">
          <p style="margin: 5px 0;">Cảm ơn quý đối tác đã hợp tác với VAWATCH</p>
          <p style="margin: 5px 0;">Hotline: 0123.456.789 | Email: contact@vawatch.com</p>
          <p style="margin: 5px 0;">Địa chỉ: 97 Đường Man Thiện, Hiệp Phú, TP.Thủ Đức</p>
        </div>
      </body>
      </html>
    `;

    // Ghi nội dung vào iframe
    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(printContent);
    frameDoc.close();

    // Đợi hình ảnh load xong
    printFrame.onload = () => {
      // In
      printFrame.contentWindow.print();
      // Xóa iframe sau khi in xong
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    };
  };

  // Lấy dữ liệu nhà cung cấp & sản phẩm ban đầu để chọn
  useEffect(() => {
    async function fetchInitialData() {
      const [nccs, sps] = await Promise.all([
        getAllSuppliers(),
        getAllProducts(),
      ]);
      // map nhanh maNCC/maSP để dễ sử dụng về sau nếu cần
      setSuppliersMap(
        nccs.reduce((acc, ncc) => ({ ...acc, [ncc.maNCC]: ncc }), {})
      );
      setProductsMap(sps.reduce((acc, sp) => ({ ...acc, [sp.maSP]: sp }), {}));
    }
    fetchInitialData();
  }, []);

  // Lấy user đăng nhập hiện tại
  useEffect(() => {
    async function fetchCurrentUser() {
      const username = localStorage.getItem("taiKhoan");
      if (!username) return;
      const allUsers = await getAllUsers();
      const user = allUsers.find((u) => u.taiKhoan === username);
      if (user) setNguoiDung(user);
    }
    fetchCurrentUser();
  }, []);

  // Lấy danh sách hóa đơn nhập
  useEffect(() => {
    async function fetchImports() {
      try {
        const data = await getAllImport();
        setImports(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách hóa đơn nhập:", error);
      }
    }
    fetchImports();
  }, []);

  // Lấy thông tin chi tiết User theo maND, lưu trong usersMap
  useEffect(() => {
    async function fetchUsersDetails() {
      const maNDs = Array.from(
        new Set(imports.map((imp) => imp.maND).filter(Boolean))
      );
      const newUsersMap = { ...usersMap };
      await Promise.all(
        maNDs.map(async (maND) => {
          if (!newUsersMap[maND]) {
            try {
              const user = await getUserById(maND);
              if (user) newUsersMap[maND] = user;
            } catch (e) {
              console.error("Lỗi lấy user theo maND", maND, e);
            }
          }
        })
      );
      setUsersMap(newUsersMap);
    }
    if (imports.length > 0) fetchUsersDetails();
  }, [imports]);

  // Lấy thông tin chi tiết sản phẩm theo maSP, lưu trong productsMap
  useEffect(() => {
    async function fetchProductsDetails() {
      const allMaSPs = imports.flatMap((imp) =>
        imp.CTHoaDonNhaps.map((ct) => ct.maSP).filter(Boolean)
      );
      const uniqueMaSPs = Array.from(new Set(allMaSPs));
      const newProductsMap = { ...productsMap };
      await Promise.all(
        uniqueMaSPs.map(async (maSP) => {
          if (!newProductsMap[maSP]) {
            try {
              const product = await getProductById(maSP);
              if (product) newProductsMap[maSP] = product;
            } catch (e) {
              console.error("Lỗi lấy sản phẩm theo maSP", maSP, e);
            }
          }
        })
      );
      setProductsMap(newProductsMap);
    }
    if (imports.length > 0) fetchProductsDetails();
  }, [imports]);

  // Lấy thông tin chi tiết nhà cung cấp theo maNCC, lưu trong suppliersMap
  useEffect(() => {
    async function fetchSuppliersDetails() {
      const maNCCs = Array.from(
        new Set(imports.map((imp) => imp.maNCC).filter(Boolean))
      );
      const newSuppliersMap = { ...suppliersMap };
      await Promise.all(
        maNCCs.map(async (maNCC) => {
          if (!newSuppliersMap[maNCC]) {
            try {
              const supplier = await getSupplierById(maNCC);
              if (supplier) newSuppliersMap[maNCC] = supplier;
            } catch (e) {
              console.error("Lỗi lấy nhà cung cấp theo maNCC", maNCC, e);
            }
          }
        })
      );
      setSuppliersMap(newSuppliersMap);
    }
    if (imports.length > 0) fetchSuppliersDetails();
  }, [imports]);

  // Xử lý thêm hóa đơn mới
  const handleAddImport = async () => {
    try {
      if (!nguoiDung) {
        toast.error("Bạn chưa đăng nhập!");
        return;
      }
      if (!formData.maNCC || !formData.phuongThuc) {
        toast.warning("Vui lòng chọn nhà cung cấp và phương thức.");
        return;
      }
      if (
        !formData.CTHoaDonNhaps.length ||
        formData.CTHoaDonNhaps.some(
          (item) => !item.maSP || item.soLuong <= 0 || item.donGia <= 0
        )
      ) {
        toast.warning("Vui lòng nhập đầy đủ thông tin chi tiết hóa đơn.");
        return;
      }

      // Gộp các sản phẩm có cùng mã
      const groupedProducts = {};
      formData.CTHoaDonNhaps.forEach((item) => {
        if (!groupedProducts[item.maSP]) {
          groupedProducts[item.maSP] = {
            maSP: item.maSP,
            soLuong: Number(item.soLuong),
            donGia: Number(item.donGia),
          };
        } else {
          // Nếu sản phẩm đã tồn tại, cộng dồn số lượng
          groupedProducts[item.maSP].soLuong += Number(item.soLuong);
          // Lấy đơn giá cao nhất nếu có sự khác biệt
          if (Number(item.donGia) > groupedProducts[item.maSP].donGia) {
            groupedProducts[item.maSP].donGia = Number(item.donGia);
          }
        }
      });

      const payload = {
        maNCC: formData.maNCC,
        maND: nguoiDung.maND,
        phuongThuc: formData.phuongThuc,
        giamGia: Number(formData.giamGia), // phần trăm
        CTHoaDonNhaps: Object.values(groupedProducts),
      };

      const result = await insertImport(payload);
      if (result) {
        setImports((prev) => [...prev, result]);
        setFormData({
          maNCC: "",
          phuongThuc: "",
          giamGia: 0,
          CTHoaDonNhaps: [
            {
              id: Date.now(),
              maSP: "",
              soLuong: 0,
              donGia: 0,
            },
          ],
        });
        const modalCloseBtn = document.querySelector(
          "#addImportModal .btn-close"
        );
        if (modalCloseBtn) modalCloseBtn.click();
        toast.success("Thêm hóa đơn nhập thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm hóa đơn nhập:", error);
      toast.error("Thêm hóa đơn nhập thất bại!");
    }
  };

  // Xóa hóa đơn hoặc chi tiết hóa đơn
  const handleDeleteImport = async (id) => {
    const confirmed = await confirmDialog(
      "Bạn có chắc chắn muốn xóa hóa đơn nhập này?"
    );
    if (confirmed) {
      try {
        const data = await deleteImprot(id);

        if (data && data.CTHoaDonNhaps) {
          // Xóa toàn bộ hóa đơn
          setImports((prev) => prev.filter((imp) => imp.maHDN !== id));
          setSelectedImport(null);
        } else {
          // Xóa chi tiết hóa đơn, cập nhật lại chi tiết
          if (!selectedImport) return;
          const updated = await getImportById(selectedImport.maHDN);

          setImports((prev) =>
            prev.map((imp) => (imp.maHDN === updated.maHDN ? updated : imp))
          );
          setSelectedImport(updated);
        }
        toast.success("Xóa hóa đơn nhập thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa hóa đơn/chi tiết:", error);
        toast.error("Xóa hóa đơn nhập thất bại!");
      }
    }
  };

  // Tìm kiếm hóa đơn (chậm khi gõ nhiều ký tự nên debounce 500ms)
  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      if (!q) {
        const allImports = await getAllImport();
        setImports(allImports);
      } else {
        const results = await searchImprot(q);
        setImports(results);
      }
      setCurrentPage(1);
    }, 500);
  };

  // Xử lý phân trang
  const totalPages = Math.ceil(imports.length / recordsPerPage);
  const currentRecords = imports.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Thay đổi trang
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Thêm dòng chi tiết hóa đơn trong form
  const addCTHDLine = () => {
    setFormData((prev) => ({
      ...prev,
      CTHoaDonNhaps: [
        ...prev.CTHoaDonNhaps,
        { id: Date.now() + Math.random(), maSP: "", soLuong: 0, donGia: 0 },
      ],
    }));
  };

  // Xóa dòng chi tiết hóa đơn theo index
  const removeCTHDLine = (id) => {
    setFormData((prev) => {
      const newCT = prev.CTHoaDonNhaps.filter((item) => item.id !== id);
      return {
        ...prev,
        CTHoaDonNhaps: newCT.length
          ? newCT
          : [{ id: Date.now(), maSP: "", soLuong: 0, donGia: 0 }],
      };
    });
  };

  // Hàm tính toán giá nhập đề xuất dựa trên giá bán
  const calculateSuggestedPrice = (currentPrice) => {
    if (!currentPrice) return 0;

    // Sản phẩm cao cấp (> 50 triệu)
    if (currentPrice > 50000000) {
      return Math.floor(currentPrice * 0.7); // 30% lợi nhuận
    }
    // Sản phẩm trung cấp (> 20 triệu)
    else if (currentPrice > 20000000) {
      return Math.floor(currentPrice * 0.75); // 25% lợi nhuận
    }
    // Sản phẩm phổ thông (> 10 triệu)
    else if (currentPrice > 10000000) {
      return Math.floor(currentPrice * 0.8); // 20% lợi nhuận
    }
    // Sản phẩm thường
    else {
      return Math.floor(currentPrice * 0.85); // 15% lợi nhuận
    }
  };

  // Thay đổi thông tin dòng chi tiết hóa đơn theo index
  const handleCTHDChange = (index, field, value) => {
    setFormData((prev) => {
      const newCT = [...prev.CTHoaDonNhaps];
      newCT[index][field] = value;

      if (field === "maSP" && value && productsMap[value]) {
        const product = productsMap[value];
        const currentPrice = product.giaBan || product.giaTien || 0;
        // Tự động đề xuất giá nhập dựa trên giá bán
        newCT[index].donGia = calculateSuggestedPrice(currentPrice);
        setSelectedProduct(product);
      }

      return { ...prev, CTHoaDonNhaps: newCT };
    });
  };

  // Xem chi tiết hóa đơn nhập
  const viewImportDetails = async (maHDN) => {
    try {
      const data = await getImportById(maHDN);
      setSelectedImport(data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết hóa đơn nhập:", error);
    }
  };

  // Tính tổng tiền của 1 hóa đơn nhập
  const calculateTotal = (importItem) => {
    if (!importItem || !importItem.CTHoaDonNhaps) return 0;
    const total = importItem.CTHoaDonNhaps.reduce((sum, ct) => {
      return sum + ct.soLuong * ct.donGia;
    }, 0);
    const discounted = total - (total * (importItem.giamGia || 0)) / 100;
    return Math.floor(discounted); // trả về phần nguyên
  };

  return (
    <div className="container py-4">
      <h3 className="text-center mb-4">Quản lý hóa đơn nhập</h3>

      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn-add ms-2"
          data-bs-toggle="modal"
          data-bs-target="#addImportModal"
        >
          <i className="bi bi-file-earmark-plus"></i> Thêm hoá đơn nhập
        </button>

        <div className="search-container" style={{ width: "50%" }}>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hóa đơn, nhà cung cấp..."
              className="form-control border-start-0 ps-0"
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                borderLeft: "none",
                boxShadow: "none",
                paddingLeft: "0",
              }}
            />
            {searchQuery && (
              <button
                className="btn btn-outline-secondary border-start-0"
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  handleSearchChange({ target: { value: "" } });
                }}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center mb-3">
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
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <table className="table  table-bordered align-middle">
        <thead className="table-dark text-center">
          <tr>
            <th>STT</th>
            <th>Mã hóa đơn</th>
            <th>Nhà cung cấp</th>
            <th>Người tạo</th>
            <th>Phương thức</th>
            <th>Giảm giá</th>
            <th>Tổng tiền</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            currentRecords.map((imp) => (
              <tr key={imp.maHDN}>
                <td className="text-center">{imports.indexOf(imp) + 1}</td>
                <td>{imp.maHDN}</td>
                <td>{suppliersMap[imp.maNCC]?.tenNCC || imp.maNCC}</td>
                <td>{usersMap[imp.maND]?.tenND || imp.maND}</td>
                <td>{imp.phuongThuc}</td>
                <td>{imp.giamGia?.toLocaleString() || 0}%</td>
                <td>{calculateTotal(imp).toLocaleString()}đ</td>
                <td className="text-center">
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#importDetailsModal"
                    onClick={() => viewImportDetails(imp.maHDN)}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      handleDeleteImport(imp.maHDN);
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Phân trang */}
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

      {/* Modal xem chi tiết hóa đơn nhập */}
      <div
        className="modal fade"
        id="importDetailsModal"
        tabIndex="-1"
        aria-labelledby="importDetailsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header bg-light">
              <h5 className="modal-title" id="importDetailsModalLabel">
                <i className="bi bi-info-circle me-2 text-primary"></i>
                Chi tiết hóa đơn nhập
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setSelectedImport(null)}
              ></button>
            </div>
            <div className="modal-body">
              {selectedImport ? (
                <>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                          <h6 className="card-title text-uppercase text-muted mb-3">
                            Thông tin hóa đơn
                          </h6>
                          <div className="mb-2 d-flex">
                            <div
                              className="text-muted"
                              style={{ width: "120px" }}
                            >
                              Mã hóa đơn:
                            </div>
                            <div className="fw-bold">
                              {selectedImport.maHDN}
                            </div>
                          </div>
                          <div className="mb-2 d-flex">
                            <div
                              className="text-muted"
                              style={{ width: "120px" }}
                            >
                              Nhà cung cấp:
                            </div>
                            <div className="fw-bold">
                              {suppliersMap[selectedImport.maNCC]?.tenNCC ||
                                selectedImport.maNCC}
                            </div>
                          </div>
                          <div className="mb-2 d-flex">
                            <div
                              className="text-muted"
                              style={{ width: "120px" }}
                            >
                              Người tạo:
                            </div>
                            <div className="fw-bold">
                              {usersMap[selectedImport.maND]?.tenND ||
                                selectedImport.maND}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                          <h6 className="card-title text-uppercase text-muted mb-3">
                            Thông tin thanh toán
                          </h6>
                          <div className="mb-2 d-flex">
                            <div
                              className="text-muted"
                              style={{ width: "120px" }}
                            >
                              Phương thức:
                            </div>
                            <div>
                              <span
                                className={`badge ${
                                  selectedImport.phuongThuc === "Tiền mặt"
                                    ? "bg-success"
                                    : "bg-info"
                                } rounded-pill px-3 py-2`}
                              >
                                {selectedImport.phuongThuc === "Tiền mặt" ? (
                                  <>
                                    <i className="bi bi-cash me-1"></i>{" "}
                                    {selectedImport.phuongThuc}
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-bank me-1"></i>{" "}
                                    {selectedImport.phuongThuc}
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="mb-2 d-flex">
                            <div
                              className="text-muted"
                              style={{ width: "120px" }}
                            >
                              Giảm giá:
                            </div>
                            <div>
                              <span className="badge bg-warning text-dark rounded-pill px-3 py-2">
                                {(selectedImport.giamGia || 0).toLocaleString()}{" "}
                                %
                              </span>
                            </div>
                          </div>
                          <div className="mb-2 d-flex">
                            <div
                              className="text-muted"
                              style={{ width: "120px" }}
                            >
                              Tổng tiền:
                            </div>
                            <div className="fw-bold fs-5 text-primary">
                              {calculateTotal(selectedImport).toLocaleString()}{" "}
                              đ
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card border-0 shadow-sm mb-3">
                    <div className="card-header bg-light py-3">
                      <h6 className="mb-0">Chi tiết sản phẩm</h6>
                    </div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th
                                className="text-center"
                                style={{ width: "60px" }}
                              >
                                STT
                              </th>
                              <th style={{ width: "80px" }}>Ảnh</th>
                              <th>Tên sản phẩm</th>
                              <th className="text-center">Số lượng</th>
                              <th className="text-start">Đơn giá</th>
                              <th className="text-start">Thành tiền</th>
                              <th
                                className="text-center"
                                style={{ width: "80px" }}
                              >
                                Thao tác
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedImport.CTHoaDonNhaps.map(
                              (detail, index) => {
                                const sp = productsMap[detail.maSP];
                                return (
                                  <tr key={detail.ma_CTHDN}>
                                    <td className="text-center">{index + 1}</td>
                                    <td>
                                      <div className="d-flex justify-content-center align-items-center">
                                        <div
                                          className="rounded border p-1"
                                          style={{
                                            width: "60px",
                                            height: "60px",
                                          }}
                                        >
                                          <img
                                            src={`http://localhost:3002${
                                              sp?.anhSP?.[0] || ""
                                            }`}
                                            alt={sp?.tenSP || ""}
                                            className="img-fluid"
                                            style={{
                                              objectFit: "contain",
                                              width: "100%",
                                              height: "100%",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </td>
                                    <td className="fw-medium">
                                      {sp?.tenSP || detail.maSP}
                                    </td>
                                    <td className="text-center">
                                      <span className="badge bg-secondary rounded-pill px-3 py-2">
                                        {detail.soLuong}
                                      </span>
                                    </td>
                                    <td className="text-start">
                                      {detail.donGia.toLocaleString()} đ
                                    </td>
                                    <td className="text-start fw-bold">
                                      {(
                                        detail.soLuong * detail.donGia
                                      ).toLocaleString()}{" "}
                                      đ
                                    </td>
                                    <td className="text-center">
                                      <button
                                        className="btn btn-sm btn-outline-danger rounded-circle"
                                        onClick={async () => {
                                          const confirmed = await confirmDialog(
                                            "Bạn có chắc muốn xóa chi tiết hóa đơn này?"
                                          );
                                          if (confirmed) {
                                            handleDeleteImport(detail.ma_CTHDN);
                                          }
                                        }}
                                        title="Xóa chi tiết"
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="card-footer bg-white">
                      <div className="d-flex justify-content-end align-items-center">
                        <div className="text-muted me-2">Tổng tiền:</div>
                        <div className="fw-bold fs-4 text-primary">
                          {calculateTotal(selectedImport).toLocaleString()} đ
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div>Chưa chọn hóa đơn để xem chi tiết.</div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary me-2"
                onClick={handlePrintBill}
              >
                <i className="fas fa-print me-1"></i>In hóa đơn
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal thêm hóa đơn nhập */}
      <div
        className="modal fade"
        id="addImportModal"
        tabIndex="-1"
        aria-labelledby="addImportModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addImportModalLabel">
                <i className="bi bi-plus-circle me-2"></i>
                Thêm hóa đơn nhập mới
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() =>
                  setFormData({
                    maNCC: "",
                    phuongThuc: "",
                    giamGia: 0,
                    CTHoaDonNhaps: [{ maSP: "", soLuong: 0, donGia: 0 }],
                  })
                }
              ></button>
            </div>
            <div className="modal-body">
              <div className="row mb-4">
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-medium">
                    <i className="bi bi-building me-1 text-primary"></i>Nhà cung
                    cấp <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.maNCC}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maNCC: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">-- Chọn nhà cung cấp --</option>
                    {Object.values(suppliersMap).map((ncc) => (
                      <option key={ncc.maNCC} value={ncc.maNCC}>
                        {ncc.tenNCC}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-medium">
                    <i className="bi bi-credit-card me-1 text-primary"></i>
                    Phương thức thanh toán{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.phuongThuc}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phuongThuc: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">-- Chọn phương thức --</option>
                    <option value="Tiền mặt">Tiền mặt</option>
                    <option value="Chuyển khoản">Chuyển khoản</option>
                    <option value="Thẻ tín dụng">Thẻ tín dụng</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-medium">
                    <i className="bi bi-percent me-1 text-primary"></i>Giảm giá
                    (%)
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="form-control"
                      placeholder="Nhập % giảm giá"
                      value={formData.giamGia}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          giamGia: Number(e.target.value),
                        }))
                      }
                    />
                    <span className="input-group-text bg-primary text-white">
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* <div className="alert alert-info mb-3">
                <i className="bi bi-info-circle-fill me-2"></i>
                Giá sản phẩm sẽ được tự động lấy từ bảng sản phẩm khi bạn chọn sản phẩm.
              </div> */}

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">
                  <i className="bi bi-list-check me-2 text-primary"></i>Chi tiết
                  sản phẩm
                </h6>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={addCTHDLine}
                >
                  <i className="bi bi-plus-lg me-1"></i> Thêm sản phẩm
                </button>
              </div>

              <div className="table-responsive mb-3">
                <table className="table table-hover table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "40px" }} className="text-center">
                        STT
                      </th>
                      <th style={{ width: "60px" }}>Ảnh</th>
                      <th>Sản phẩm</th>
                      <th style={{ width: "100px" }}>Số lượng</th>
                      <th style={{ width: "180px" }}>Đơn giá nhập (đ)</th>
                      <th style={{ width: "150px" }}>Thành tiền (đ)</th>
                      <th style={{ width: "60px" }} className="text-center">
                        Xóa
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.CTHoaDonNhaps.map((item, index) => {
                      const selectedProduct = item.maSP
                        ? productsMap[item.maSP]
                        : null;
                      const subtotal = item.soLuong * item.donGia;
                      return (
                        <tr key={item.id || index} className="align-middle">
                          <td className="text-center">{index + 1}</td>
                          <td>
                            {selectedProduct ? (
                              <img
                                src={`http://localhost:3002${
                                  selectedProduct?.anhSP?.[0] || ""
                                }`}
                                alt={selectedProduct?.tenSP || ""}
                                className="img-fluid"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "contain",
                                }}
                              />
                            ) : (
                              <div className="text-center">
                                <i className="bi bi-image text-muted"></i>
                              </div>
                            )}
                          </td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={item.maSP}
                              onChange={(e) =>
                                handleCTHDChange(index, "maSP", e.target.value)
                              }
                            >
                              <option value="">-- Chọn sản phẩm --</option>
                              {Object.values(productsMap).map((sp) => (
                                <option key={sp.maSP} value={sp.maSP}>
                                  {sp.tenSP}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              min={1}
                              className={`form-control ${
                                selectedProduct &&
                                item.donGia &&
                                item.donGia >=
                                  (selectedProduct.giaBan ||
                                    selectedProduct.giaTien)
                                  ? "border-danger"
                                  : ""
                              }`}
                              placeholder="SL"
                              value={item.soLuong}
                              onChange={(e) =>
                                handleCTHDChange(
                                  index,
                                  "soLuong",
                                  Number(e.target.value)
                                )
                              }
                            />
                          </td>
                          <td>
                            <div className="mb-2">
                              <div className="input-group input-group-sm">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  className={`form-control ${
                                    selectedProduct &&
                                    item.donGia &&
                                    item.donGia >=
                                      (selectedProduct.giaBan ||
                                        selectedProduct.giaTien)
                                      ? "border-danger"
                                      : ""
                                  }`}
                                  placeholder="Đơn giá"
                                  value={item.donGia.toLocaleString("vi-VN")}
                                  onChange={(e) => {
                                    const rawValue = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    handleCTHDChange(
                                      index,
                                      "donGia",
                                      Number(rawValue)
                                    );
                                  }}
                                />
                                <span className="input-group-text">đ</span>
                              </div>

                              {selectedProduct && (
                                <div
                                  className="text-muted mt-1 d-flex align-items-center"
                                  style={{ fontSize: "0.85rem" }}
                                >
                                  <i className="bi bi-tag-fill me-1 text-secondary"></i>
                                  Giá bán:{" "}
                                  {(
                                    selectedProduct.giaBan ||
                                    selectedProduct.giaTien
                                  )?.toLocaleString()}
                                  đ
                                </div>
                              )}

                              {selectedProduct &&
                                item.donGia >=
                                  (selectedProduct.giaBan ||
                                    selectedProduct.giaTien) && (
                                  <div
                                    className="text-danger mt-1"
                                    style={{ fontSize: "0.85rem" }}
                                  >
                                    <i className="bi bi-exclamation-circle me-1"></i>
                                    Giá nhập phải thấp hơn giá bán
                                  </div>
                                )}
                            </div>
                          </td>
                          <td className="text-start fw-bold text-primary">
                            {subtotal.toLocaleString()} đ
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => removeCTHDLine(item.id)}
                              disabled={formData.CTHoaDonNhaps.length === 1}
                              title="Xóa sản phẩm"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer bg-light">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-6">
                    {(() => {
                      const totalQuantity = formData.CTHoaDonNhaps.reduce(
                        (sum, item) => sum + Number(item.soLuong || 0),
                        0
                      );

                      const subtotal = formData.CTHoaDonNhaps.reduce(
                        (sum, item) =>
                          sum +
                          Number(item.soLuong || 0) * Number(item.donGia || 0),
                        0
                      );

                      const discount = Math.floor(
                        subtotal * (Number(formData.giamGia || 0) / 100)
                      );

                      const total = Math.floor(subtotal - discount);

                      return (
                        <div className="summary-container p-3 border rounded bg-light">
                          <div className="d-flex justify-content-between mb-1">
                            <span>Tổng số lượng:</span>
                            <span className="fw-medium">
                              {totalQuantity} sản phẩm
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mb-1">
                            <span>Tạm tính:</span>
                            <span className="fw-medium">
                              {subtotal.toLocaleString("vi-VN")} đ
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mb-1">
                            <span>Giảm giá ({formData.giamGia}%):</span>
                            <span className="fw-medium text-danger">
                              -{discount.toLocaleString("vi-VN")} đ
                            </span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="fw-medium">Tổng cộng:</span>
                            <span className="fw-bold fs-5 text-primary">
                              {total.toLocaleString("vi-VN")} đ
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="col-md-6 d-flex justify-content-start align-items-center">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      data-bs-dismiss="modal"
                    >
                      Hủy
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleAddImport}
                      disabled={
                        !formData.maNCC ||
                        !formData.phuongThuc ||
                        formData.CTHoaDonNhaps.some(
                          (item) => !item.maSP || item.soLuong <= 0
                        )
                      }
                    >
                      <i className="bi bi-save me-1"></i>Lưu hóa đơn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HoaDonNhapAdmin;

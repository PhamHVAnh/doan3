import "./SanPhamAdmin.scss";
import { useEffect, useRef, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  searchProducts,
  updateProduct,
} from "../../../services/sanPhamService";
import {
  getAllCtCategory,
  getCtCategoryById,
} from "../../../services/danhMucService";
import { getAllImages } from "../../../services/imgService";
import { confirmDialog } from "../../../utils/confirmDialog";
import { toast } from 'react-toastify';

function SanPhamAdmin() {
  if (!localStorage.getItem("token")) {
    window.location.replace("/dang-nhap");
  }
  const [modalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const searchTimeoutRef = useRef(null);

  const [formData, setFormData] = useState({
    tenSP: "",
    Thuonghieu: "",
    Xuatxu: "",
    Kieudang: "",
    Loaimay: "",
    Duongkinh: "",
    Chatlieu: "",
    Sizeday: "",
    Chongnuoc: "",
    soLuong: 0,
    giaTien: "",
    giamGia: "",
    moTa: "",
    maDM: "",
    anhSP: "",
  });

  const resetFormData = () => {
    setFormData({
      tenSP: "",
      Thuonghieu: "",
      Xuatxu: "",
      Kieudang: "",
      Loaimay: "",
      Duongkinh: "",
      Chatlieu: "",
      Sizeday: "",
      Chongnuoc: "",
      soLuong: 0,
      giaTien: "",
      giamGia: "",
      moTa: "",
      maDM: "",
      anhSP: "",
    });
  };

  const [showImageList, setShowImageList] = useState(false);
  const [imageList, setImageList] = useState([]);
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("images", file);

    const response = await fetch("http://localhost:3002/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Upload failed:", text);
      throw new Error("Upload ảnh thất bại, status: " + response.status);
    }

    const data = await response.json();
    return data.imageUrls[0]; // lấy ảnh đầu tiên từ mảng imageUrls
  };

  useEffect(() => {
    const fetchImages = async () => {
      const images = await getAllImages();
      setImageList(images);
    };
    fetchImages();
  }, []);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      tenSP: product.tenSP,
      Thuonghieu: product.Thuonghieu,
      Xuatxu: product.Xuatxu,
      Kieudang: product.Kieudang,
      Loaimay: product.Loaimay,
      Duongkinh: product.Duongkinh,
      Chatlieu: product.Chatlieu,
      Sizeday: product.Sizeday,
      Chongnuoc: product.Chongnuoc,
      soLuong: product.soLuong,
      giaTien: product.giaTien,
      giamGia: product.giamGia,
      moTa: product.moTa,
      maDM: product.maDM,
      anhSP: product.anhSP,
    });
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            const category = await getCtCategoryById(product.maDM);
            return { ...product, tenDM: category.tenDM };
          })
        );
        setProducts(updatedProducts);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getAllCtCategory();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const getCategoryName = (maDM) => {
    const category = categories.find((cat) => cat.maDM === maDM);
    return category ? category.tenDM : "Không xác định";
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      const data = await createProduct(formData);
      setProducts((prevProducts) => [...prevProducts, data]);
      setModalOpen(false);
      toast.success("Thêm sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      toast.error("Thêm sản phẩm thất bại!");
    }
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;
    try {
      const updatedData = { ...formData, maSP: selectedProduct.maSP };
      await updateProduct(updatedData);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.maSP === selectedProduct.maSP
            ? { ...product, ...formData }
            : product
        )
      );
      setModalOpen(false);
      toast.success("Cập nhật sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      toast.error("Cập nhật sản phẩm thất bại!");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDialog("Bạn có chắc chắn muốn xóa sản phẩm này?");
    if (confirmed) {
      try {
        await deleteProduct(id);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.maSP !== id)
        );
        toast.success("Xóa sản phẩm thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        toast.error("Xóa sản phẩm thất bại!");
      }
    }
  };

  const handleSearch = async (query, categoryId) => {
    try {
      const data = await searchProducts(query, categoryId);
      // Lọc thêm ở phía client để tìm kiếm trên tất cả các trường
      const filteredData = data.filter(item => {
        // Nếu có categoryId được chọn, kiểm tra trước
        if (categoryId && item.maDM !== categoryId) {
          return false;
        }
        // Nếu có từ khóa tìm kiếm, kiểm tra tất cả các trường
        if (query.trim()) {
          return Object.values(item).some(value => 
            String(value).toLowerCase().includes(query.toLowerCase())
          );
        }
        return true;
      });
      setProducts(filteredData);
      setCurrentPage(1); // reset page khi tìm kiếm
    } catch (error) {
      console.error("Lỗi tìm kiếm sản phẩm:", error);
    }
  };

  // Thêm useEffect để xử lý debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(searchQuery, selectedCategory);
    }, 300);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery, selectedCategory]); // Thêm selectedCategory vào dependencies

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = products.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(products.length / recordsPerPage);

  const getProductImage = (imageArray) => {
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      return `http://localhost:3002${imageArray[0]}`;
    }
    return "http://localhost:3002/uploads/1747666496354.png";
  };

  return (
    <div className="container-fluid mt-1">
      <h2 className="mb-2 mt-2 text-center title-text-main">
        Quản lý sản phẩm
      </h2>
      <div className="container-fluid mt-1">
        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn-add"
            onClick={() => {
              setSelectedProduct(null);
              resetFormData();
              setModalOpen(true);
            }}
          >
            <i className="bi bi-file-earmark-plus"></i> Thêm sản phẩm
          </button>
          <div className="search-container" style={{ width: "50%" }}>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm theo mã, tên, giá..."
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
                    handleSearch("", selectedCategory);
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
          <label className="me-2 fw-semibold ms-3">Danh mục:</label>
          <select
            className="form-select w-auto"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              handleSearch(searchQuery, e.target.value);
            }}
          >
            <option value="">Tất cả</option>
            {categories.map((cat) => (
              <option key={cat.maDM} value={cat.maDM}>
                {cat.tenDM}
              </option>
            ))}
          </select>
        </div>

        <table className="table tb-sanPham table-bordered text-center align-middle">
          <thead>
            <tr>
              <th>STT</th>
              <th>Danh mục</th>
              <th>Tên hàng</th>
              <th>Thương hiệu</th>
              <th>Xuất xứ</th>
              <th>Kiểu dáng</th>
              <th>Loại máy</th>
              <th>Đường kính</th>
              <th>Chất liệu</th>
              <th>Size dây</th>
              <th>Chống nước</th>
              <th>Ảnh</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Giảm giá</th>
              <th colSpan={2}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((product, index) => (
              <tr key={product.maSP}>
                <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                <td>{getCategoryName(product.maDM)}</td>
                <td>{product.tenSP}</td>
                <td>{product.Thuonghieu}</td>
                <td>{product.Xuatxu}</td>
                <td>{product.Kieudang}</td>
                <td>{product.Loaimay}</td>
                <td>{product.Duongkinh}</td>
                <td>{product.Chatlieu}</td>
                <td>{product.Sizeday}</td>
                <td>{product.Chongnuoc}</td>
                <td>
                  <img
                    src={getProductImage(product.anhSP)}
                    alt={product.tenSP}
                    className="product-img"
                  />
                </td>

                <td>{product.soLuong}</td>
                <td>{product.giaTien?.toLocaleString()}đ</td>
                <td>{product.giamGia?.toLocaleString()}%</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEditClick(product)}
                    title="Cập nhật thông tin"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(product.maSP)}
                    title="Xóa sản phẩm"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

        {modalOpen && (
          <div className="sanpham-admin-modal">
            <div className="modal-overlay">
              <div className="modal-content p-4 rounded shadow">
                {/* Close button */}
                <span
                  className="close-btn"
                  onClick={() => {
                    setModalOpen(false);
                    setShowImageList(false);
                  }}
                >
                  <i className="bi bi-x-circle"></i>
                </span>

                <h4 className="my-3 text-center">
                  {selectedProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
                </h4>

                {/* Body content: two-column layout */}
                <div className="modal-body d-flex flex-wrap gap-4">
                  {/* Left: Image preview and upload */}
                  <div
                    className="image-section flex-fill"
                    style={{ flex: "1 1 40%" }}
                  >
                    <label className="form-label">Ảnh sản phẩm</label>
                    <div className="selected-images mb-1">
                      <img
                        src={
                          Array.isArray(formData.anhSP) &&
                          formData.anhSP.length > 0
                            ? `http://localhost:3002${formData.anhSP[0]}`
                            : "http://localhost:3002/uploads/1747666496354.png"
                        }
                        alt="Ảnh sản phẩm"
                        className="img-fluid rounded border"
                        style={{ maxHeight: 100, objectFit: "contain" }}
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const uploadedPath = await uploadImage(file);
                            setFormData((prev) => ({
                              ...prev,
                              anhSP: [uploadedPath],
                            }));
                          } catch (err) {
                            console.error("Lỗi upload ảnh:", err);
                          }
                        }
                      }}
                    />
                  </div>

                  {/* Right: Form inputs */}
                  <div
                    className="form-section flex-fill"
                    style={{ flex: "1 1 55%" }}
                  >
                    <div className="row">
                      {[
                        { id: "tenSP", label: "Tên" },
                        { id: "Thuonghieu", label: "Thương hiệu" },
                        { id: "Xuatxu", label: "Xuất xứ" },
                        { id: "Kieudang", label: "Kiểu dáng" },
                        { id: "Loaimay", label: "Loại máy" },
                        { id: "Duongkinh", label: "Đường kính" },
                        { id: "Chatlieu", label: "Chất liệu" },
                        { id: "Sizeday", label: "Size dây" },
                        { id: "Chongnuoc", label: "Chống nước" },
                      ].map((field) => (
                        <div className="col-6 mb-3" key={field.id}>
                          <div className="input-group">
                            <span className="input-group-text w-40 text-truncate">
                              {field.label}
                            </span>
                            <input
                              type="text"
                              id={field.id}
                              className="form-control"
                              placeholder={`Nhập ${field.label.toLowerCase()}`}
                              value={formData[field.id]}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      ))}

                      {/* Danh mục */}
                      <div className="col-6 mb-3">
                        <div className="input-group">
                          <span className="input-group-text w-40">
                            Danh mục
                          </span>
                          <select
                            id="maDM"
                            className="form-select"
                            value={formData.maDM}
                            onChange={handleInputChange}
                          >
                            <option value="">Chọn danh mục</option>
                            {categories.map((cat) => (
                              <option key={cat.maDM} value={cat.maDM}>
                                {cat.tenDM}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Số lượng */}
                      <div className="col-6 mb-3">
                        <div className="input-group">
                          <span className="input-group-text w-40">
                            Số lượng
                          </span>
                          <input
                            type="number"
                            id="soLuong"
                            className="form-control"
                            placeholder="0"
                            value={formData.soLuong}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      {/* Giá tiền */}
                      <div className="col-6 mb-3">
                        <div className="input-group">
                          <span className="input-group-text w-40">
                            Giá tiền
                          </span>

                          <input
                            type="text"
                            id="giaTien"
                            className="form-control text-start"
                            placeholder="VD: 1.200.000"
                            value={Number(formData.giaTien || 0).toLocaleString(
                              "vi-VN"
                            )}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^\d]/g, ""); // chỉ giữ số
                              setFormData({
                                ...formData,
                                giaTien: Number(raw),
                              });
                            }}
                          />

                          <span className="input-group-text">đ</span>
                        </div>
                      </div>

                      {/* Giảm giá */}
                      <div className="col-6 mb-3">
                        <div className="input-group">
                          <span className="input-group-text w-40">
                            Giảm giá (%)
                          </span>
                          <input
                            type="number"
                            id="giamGia"
                            className="form-control"
                            placeholder="0"
                            value={formData.giamGia}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save button */}
                    <div className="mt-3 text-end">
                      <button
                        className="btn btn-primary"
                        onClick={selectedProduct ? handleUpdate : handleSubmit}
                      >
                        <i className="bi bi-save me-1" />
                        {selectedProduct ? "Cập nhật" : "Thêm"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SanPhamAdmin;

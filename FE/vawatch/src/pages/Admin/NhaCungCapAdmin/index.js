import "./NhaCungCapAdmin.scss";
import { useEffect, useRef, useState } from "react";
import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  searchSuppliers,
  updateSupplier,
} from "../../../services/nhaCungCapAdmin";
import { toast } from 'react-toastify';
import { confirmDialog } from "../../../utils/confirmDialog";

function NhaCungCapAdmin() {
  if (!localStorage.getItem("token")) {
    window.location.replace("/dang-nhap");
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  const [formData, setFormData] = useState({
    tenNCC: "",
    diaChi: "",
    sdt: "",
    email: "",
  });

  const fetchSuppliers = async () => {
    try {
      const data = await getAllSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (modalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalOpen]);

  const resetFormData = () => {
    setFormData({
      tenNCC: "",
      diaChi: "",
      sdt: "",
      email: "",
    });
  };

  const handleEditClick = (supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      tenNCC: supplier.tenNCC || "",
      diaChi: supplier.diaChi || "",
      sdt: supplier.sdt || "",
      email: supplier.email || "",
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const { tenNCC, diaChi, sdt, email } = formData;
    if (!tenNCC || !diaChi || !sdt || !email) {
      toast.warning("Vui lòng điền đầy đủ thông tin.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const { tenNCC, diaChi, sdt, email } = formData;
    if (!tenNCC || !diaChi || !sdt || !email) {
      toast.warning("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const data = await createSupplier(formData);
      setSuppliers((prev) => [...prev, data]);
      setModalOpen(false);
      toast.success("Thêm nhà cung cấp thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm nhà cung cấp:", error);
      toast.error("Thêm nhà cung cấp thất bại!");
    }
  };

  const handleUpdate = async () => {
    if (!selectedSupplier) return;
    try {
      const updatedData = { ...formData, maNCC: selectedSupplier.maNCC };
      await updateSupplier(updatedData);
      setSuppliers((prev) =>
        prev.map((sup) =>
          sup.maNCC === selectedSupplier.maNCC ? { ...sup, ...formData } : sup
        )
      );
      setModalOpen(false);
      toast.success("Cập nhật nhà cung cấp thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật nhà cung cấp:", error);
      toast.error("Cập nhật nhà cung cấp thất bại!");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDialog("Bạn có chắc chắn muốn xóa nhà cung cấp này?");
    if (confirmed) {
      try {
        await deleteSupplier(id);
        setSuppliers((prev) => prev.filter((sup) => sup.maNCC !== id));
        toast.success("Xóa nhà cung cấp thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa nhà cung cấp:", error);
        toast.error("Xóa nhà cung cấp thất bại!");
      }
    }
  };

  const handleSearch = async (query) => {
    try {
      const data = await searchSuppliers(query);
      setSuppliers(data);
      setCurrentPage(1);
    } catch (error) {
      console.log("Lỗi tìm kiếm:", error);
    }
  };

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        fetchSuppliers();
      }
    }, 300);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = suppliers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(suppliers.length / recordsPerPage);

  return (
    <div className="container-fluid mt-1">
      <h3 className="mb-2 mt-2 text-center title-text-main">
        Danh sách nhà cung cấp
      </h3>

      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn-add"
          onClick={() => {
            setSelectedSupplier(null);
            resetFormData();
            setModalOpen(true);
          }}
        >
          <i className="bi bi-file-earmark-plus"></i> Thêm nhà cung cấp
        </button>
        <div className="search-container" style={{ width: "50%" }}>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên nhà cung cấp..."
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
                  fetchSuppliers();
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
      <table className="table table-bordered text-center align-middle">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã nhà cung cấp</th>
            <th>Tên nhà cung cấp</th>
            <th>Địa chỉ</th>
            <th>Điện thoại</th>
            <th>Email</th>
            <th colSpan={2}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((supplier, index) => (
            <tr key={supplier.maNCC}>
              <td>{indexOfFirst + index + 1}</td>
              <td>{supplier.maNCC}</td>
              <td>{supplier.tenNCC}</td>
              <td>{supplier.diaChi}</td>
              <td>{supplier.sdt}</td>
              <td>{supplier.email}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => handleEditClick(supplier)}
                  title="Cập nhật thông tin"
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(supplier.maNCC)}
                  title="Xóa thông tin"
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
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedSupplier ? "Cập nhật thông tin" : "Thêm mới thông tin"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
              </div>

              <div className="modal-body">
                {["tenNCC", "diaChi", "sdt", "email"].map((field, idx) => (
                  <div className="mb-3" key={idx}>
                    <input
                      type={field === "email" ? "email" : "text"}
                      id={field}
                      className="form-control"
                      placeholder={
                        field === "tenNCC"
                          ? "Tên nhà cung cấp"
                          : field === "diaChi"
                          ? "Địa chỉ"
                          : field === "sdt"
                          ? "Số điện thoại"
                          : "Email"
                      }
                      value={formData[field]}
                      onChange={handleInputChange}
                      ref={field === "tenNCC" ? inputRef : null}
                    />
                  </div>
                ))}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={selectedSupplier ? handleUpdate : handleSubmit}
                >
                  <i className="bi bi-save"></i> {selectedSupplier ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NhaCungCapAdmin;

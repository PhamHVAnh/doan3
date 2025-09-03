import React, { useEffect, useState, useRef } from "react";
import {
  getAllCategory,
  insertCategory,
  updateCategory,
  deleteCategory,
  searchCategory,
} from "../../../services/danhMucService";
import "./DanhMuc.scss";
import {
  Button,
  Modal,
  Form,
  Table,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { toast } from 'react-toastify';
import { confirmDialog } from "../../../utils/confirmDialog";

function DanhMucAdmin() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [tenDM, setTenDM] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeoutRef = useRef(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.replace("/dang-nhap");
    } else {
      fetchCategories();
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategory();
      setCategories(data);
      setCurrentPage(1); // reset page
    } catch (error) {
      console.error("Lỗi khi load danh mục:", error);
    }
  };

  const handleShowModal = (category = null) => {
    setEditData(category);
    setTenDM(category ? category.tenDM : "");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditData(null);
    setTenDM("");
  };

  const handleSave = async () => {
    try {
      if (editData) {
        await updateCategory({ ...editData, tenDM });
      } else {
        await insertCategory({ tenDM });
      }
      await fetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDialog("Bạn có chắc chắn muốn xóa danh mục này?");
    if (confirmed) {
      try {
        await deleteCategory(id);
        setCategories((prev) => prev.filter((item) => item.maDM !== id));
        toast.success("Xóa danh mục thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        toast.error("Xóa danh mục thất bại!");
      }
    }
  };

  const handleSearch = async (query) => {
    try {
      if (query.trim()) {
        const data = await searchCategory(query);
        // Lọc thêm ở phía client để tìm kiếm trên tất cả các trường
        const filteredData = data.filter(item => 
          Object.values(item).some(value => 
            String(value).toLowerCase().includes(query.toLowerCase())
          )
        );
        setCategories(filteredData);
      } else {
        const data = await getAllCategory();
        setCategories(data);
      }
      setCurrentPage(1); // reset page khi tìm kiếm
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  // Thêm useEffect để xử lý debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchTerm]);

  // Tính toán phân trang
  const totalPages = Math.ceil(categories.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = categories.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  return (
    <div className="container mt-4">
         <h2 className="mb-2 mt-2 text-center title-text-main">
        Quản lý danh mục
      </h2>

      <div className="d-flex justify-content-between mb-3">
        <button
          variant="dark"
          className="mb-3 btn-add"
          onClick={() => handleShowModal()}
        >
          + Thêm danh mục
        </button>
        <div className="search-container" style={{ width: "50%" }}>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tên danh mục..."
              className="form-control border-start-0 ps-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderLeft: "none",
                boxShadow: "none",
                paddingLeft: "0"
              }}
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary border-start-0"
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  handleSearch("");
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
      <Table bordered hover className="table-admin text-center align-middle">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã Danh Mục</th>
            <th>Tên Danh Mục</th>
            <th colSpan={2}>Thao Tác</th> {/* colSpan=2 đúng */}
          </tr>
        </thead>
        <tbody>
          {currentRecords.length > 0 ? (
            currentRecords.map((dm, index) => (
              <tr key={dm.maDM}>
                <td>{startIndex + index + 1}</td>
                <td>{dm.maDM}</td>
                <td>{dm.tenDM}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleShowModal(dm)}
                    title="Cập nhật thông tin"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(dm.maDM)}
                    title="Xóa thông tin"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Phân trang và chọn số bản ghi */}
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


      {/* Modal thêm/sửa */}
    <Modal show={showModal} onHide={handleCloseModal} centered>
  <Modal.Header closeButton>
    <Modal.Title>{editData ? "Cập nhật" : "Thêm"} Danh Mục</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="formTenDM">
        <Form.Label>Tên danh mục</Form.Label>
        <Form.Control
          type="text"
          value={tenDM}
          onChange={(e) => setTenDM(e.target.value)}
          required
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      Hủy
    </Button>
    <Button variant="primary" onClick={handleSave}>
      Lưu
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
}

export default DanhMucAdmin;

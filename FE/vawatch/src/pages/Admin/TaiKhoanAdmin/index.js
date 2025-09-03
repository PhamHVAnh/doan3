import { useEffect, useRef, useState } from "react";
import {
  deleteUser,
  getAllUsers,
  searchUser,
  updateUser,
} from "../../../services/nguoiDungService";
import "./TaiKhoanAdmin.scss";
import { confirmDialog } from "../../../utils/confirmDialog";
import { toast } from 'react-toastify';

function TaiKhoanAdmin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [vaiTroFilter, setVaiTroFilter] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản:", error);
    }
  };

  const handleRoleChange = async (maND, maVT) => {
    try {
      const updated = await updateUser({ maND, maVT });
      setUsers((prev) => prev.map((u) => (u.maND === maND ? updated : u)));
      setSelectedUser(null);
    } catch (error) {
      console.error("Lỗi cập nhật vai trò:", error);
    }
  };

  const handleDelete = async (maND) => {
    const confirmed = await confirmDialog("Bạn có chắc chắn muốn xóa tài khoản này?");
    if (confirmed) {
      try {
        await deleteUser(maND);
        setUsers((prev) => prev.filter((u) => u.maND !== maND));
        setSelectedUser(null);
        toast.success("Xóa tài khoản thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        toast.error("Xóa tài khoản thất bại!");
      }
    }
  };

  const handleSearch = async (query) => {
    try {
      const data = await searchUser(query);
      setUsers(data);
    } catch (error) {
      console.error("Lỗi tìm kiếm người dùng:", error);
    }
  };

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      if (searchQuery.trim()) handleSearch(searchQuery);
      else fetchUsers();
    }, 300);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery]);

  const filteredUsers = users.filter((u) =>
    vaiTroFilter === "Tất cả" ? true : u.maVT === vaiTroFilter
  );

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);

  return (
    <div className="container py-4">
      <h3 className="text-center mb-4 fw-bold">Quản lý tài khoản</h3>

      <div className="d-flex justify-content-between mb-3">
        <div className="search-container" style={{ width: "50%" }}>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên người dùng..."
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
                  fetchUsers();
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
        <label className="me-2 fw-semibold">Hiển thị:</label>
        <select
          className="form-select w-auto"
          value={vaiTroFilter}
          onChange={(e) => {
            setVaiTroFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="Tất cả">Tất cả vai trò</option>
          <option value="A01">Khách hàng</option>
          <option value="A00">Nhân viên</option>
        </select>
      </div>
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-bordered text-center align-middle mb-0 bg-white rounded overflow-hidden">
          <thead className="table-light">
            <tr>
              <th>STT</th>
              <th>Ảnh</th>
              <th>Tài khoản</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-muted py-4">
                  Không có dữ liệu phù hợp.
                </td>
              </tr>
            ) : (
              currentRecords.map((user, index) => (
                <tr
                  key={user.maND}
                  className="align-middle"
                  style={{ cursor: "default" }}
                  onMouseEnter={(e) =>
                    e.currentTarget.classList.add("table-primary")
                  }
                  onMouseLeave={(e) =>
                    e.currentTarget.classList.remove("table-primary")
                  }
                >
                  <td>{indexOfFirst + index + 1}</td>
                  <td>
                    <img
                      src={
                        user.anhThe
                          ? `http://localhost:3002${user.anhThe}`
                          : "http://localhost:3002/uploads/1747737217716.jpg"
                      }
                      alt="avatar"
                      width={50}
                      height={50}
                      className="rounded-circle border border-2 border-secondary object-fit-cover"
                    />
                  </td>
                  <td className="fw-semibold">{user.taiKhoan}</td>
                  <td>{user.tenND}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.maVT === "A01"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {user.maVT === "A01" ? "Khách hàng" : "Nhân viên"}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => setSelectedUser(user)}
                      title="Sửa vai trò"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(user.maND)}
                      title="Xóa tài khoản"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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

      {/* Modal for Edit */}
      {selectedUser && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content rounded shadow">
              <div className="modal-header">
                <h5 className="modal-title">Cập nhật vai trò</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedUser(null)}
                ></button>
              </div>
              <div className="modal-body d-flex gap-3 align-items-center">
                <img
                  src={
                    selectedUser.anhThe
                      ? `http://localhost:3002${selectedUser.anhThe}`
                      : "/http://localhost:3002/uploads/1747737217716.jpg"
                  }
                  alt="avatar"
                  width={80}
                  height={80}
                  className="rounded-circle border border-2 border-secondary object-fit-cover"
                />
                <div className="flex-grow-1">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Tài khoản</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedUser.taiKhoan}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Vai trò</label>
                    <select
                      className="form-select"
                      value={selectedUser.maVT}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, maVT: e.target.value })
                      }
                    >
                      <option value="A01">Khách hàng</option>
                      <option value="A00">Nhân viên</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedUser(null)}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    handleRoleChange(selectedUser.maND, selectedUser.maVT)
                  }
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaiKhoanAdmin;

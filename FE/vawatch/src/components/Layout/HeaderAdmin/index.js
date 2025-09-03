import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function HeaderAdmin({ toggleSidebar, userImg, taiKhoan }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const dropdownRef1 = useRef(null);

  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
      setShowNotifications(false);
      setShowMessages(false);
    }
  }
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("taiKhoan");
    navigate("/");
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <nav className="navbar01 navbar-expand-lg navbar-light bg-white topbar mb-4 static-top shadow">
      <div className="container-fluid d-flex align-items-center">
        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="btn btn-light"
          style={{ width: 38, height: 38 }}
        >
          <i
            className="fas fa-bars"
            style={{ fontSize: 18, color: "#333" }}
          ></i>
        </button>

        {/* Contact Email */}
        <div
          className="d-none d-md-flex align-items-center me-auto"
          style={{ fontSize: 14, color: "#555", gap: 6, margin: "0 auto" }}
        >
          <i className="fas fa-envelope"></i>
          <span>donghovietanh.com</span>
        </div>

        {/* Topbar Navbar */}
        <ul className="navbar-nav ml-auto align-items-center d-flex gap-3 mb-0">
          {/* Notifications */}
          <li
            className="nav-item dropdown no-arrow mx-1 position-relative"
            ref={dropdownRef1}
          >
            <span
              className="nav-link position-relative"
              role="button"
              aria-label="Notifications"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowMessages(false);
                setShowDropdown(false);
              }}
              style={{
                cursor: "pointer",
                padding: "6px",
                borderRadius: "50%",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0f0f0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <i
                className="fas fa-bell fa-fw"
                style={{ fontSize: "18px", color: "#333" }}
              ></i>
              <span
                className="badge badge-danger badge-counter position-absolute top-0 start-100 translate-middle"
                style={{
                  backgroundColor: "#dc3545",
                  fontSize: "0.7rem",
                  padding: "3px 6px",
                  borderRadius: "50%",
                  fontWeight: "bold",
                }}
              >
                3+
              </span>
            </span>
            {showNotifications && (
              <div
                className="dropdown-menu shadow animated--grow-in show mt-2"
                style={{
                  right: 0,
                  left: "auto",
                  position: "absolute",
                  zIndex: 10,
                  minWidth: 250,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  backgroundColor: "#fff",
                }}
              >
                <h6 className="dropdown-header">🔔 Thông báo</h6>
                <span className="dropdown-item">
                  📦 Đơn hàng mới vừa được đặt
                </span>
                <span className="dropdown-item">⚠️ Sản phẩm sắp hết hàng</span>
                <span className="dropdown-item">🔄 Cập nhật hệ thống</span>
              </div>
            )}
          </li>

          {/* Messages */}
          <li
            className="nav-item dropdown no-arrow mx-1 position-relative"
            ref={dropdownRef1}
          >
            <span
              className="nav-link position-relative"
              role="button"
              aria-label="Messages"
              onClick={() => {
                setShowMessages(!showMessages);
                setShowNotifications(false);
                setShowDropdown(false);
              }}
              style={{
                cursor: "pointer",
                padding: "6px",
                borderRadius: "50%",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0f0f0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <i
                className="fas fa-envelope fa-fw"
                style={{ fontSize: "18px", color: "#333" }}
              ></i>
              <span
                className="badge badge-danger badge-counter position-absolute top-0 start-100 translate-middle"
                style={{
                  backgroundColor: "#dc3545",
                  fontSize: "0.7rem",
                  padding: "3px 6px",
                  borderRadius: "50%",
                  fontWeight: "bold",
                }}
              >
                5
              </span>
            </span>
            {showMessages && (
              <div
                className="dropdown-menu shadow animated--grow-in show mt-2"
                style={{
                  right: 0,
                  left: "auto",
                  position: "absolute",
                  zIndex: 10,
                  minWidth: 250,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  backgroundColor: "#fff",
                }}
              >
                <h6 className="dropdown-header">📩 Tin nhắn</h6>
                <span className="dropdown-item">
                  👤 Khách A: Hỏi về sản phẩm X
                </span>
                <span className="dropdown-item">
                  🔧 Khách B: Cần hỗ trợ bảo hành
                </span>
                <span className="dropdown-item">
                  💬 Khách C: Góp ý giao diện
                </span>
              </div>
            )}
          </li>

          <div className="topbar-divider d-none d-sm-block mx-2"></div>

          {/* User Info */}
          <li className="nav-item dropdown no-arrow position-relative">
            <div
              className="nav-link dropdown-toggle d-flex align-items-center"
              role="button"
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ cursor: "pointer" }}
              aria-haspopup="true"
              aria-expanded={showDropdown}
            >
              <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                {taiKhoan || "Admin"}
              </span>
              <img
                className="img-profile rounded-circle"
                src={userImg}
                alt="avatar"
                width={32}
                height={32}
              />
            </div>

            {showDropdown && (
              <div
                className="dropdown-menu shadow animated--grow-in show mt-2"
                style={{ right: 0, left: "auto", position: "absolute" }}
                aria-label="User menu"
              >
                <button className="dropdown-item" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                  Đăng xuất
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default HeaderAdmin;

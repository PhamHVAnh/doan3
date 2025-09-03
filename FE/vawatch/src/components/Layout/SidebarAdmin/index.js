import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./SidebarAdmin.css";

const SidebarAdmin = ({ collapsed, userImg, taiKhoan }) => {
  return (
    <nav className={`sidebar d-flex flex-column flex-shrink-0 position-fixed ${collapsed ? "collapsed" : ""}`}>
      <div className="p-4">
        <h4 className="logo-text fw-bold mb-0">Watch-admin</h4>
        <p className="text-muted small hide-on-collapse">Dashboard</p>
      </div>

      <div className="nav flex-column">
        <NavLink to="/admin/tong-quan" className="sidebar-link text-decoration-none p-3">
          <i className="fas fa-home me-3"></i>
          <span className="hide-on-collapse">Tổng quan</span>
        </NavLink>

        <NavLink to="/admin/danh-muc-admin" className="sidebar-link text-decoration-none p-3">
          <i className="fas fa-list-alt me-3"></i>
          <span className="hide-on-collapse">Danh mục</span>
        </NavLink>

        <NavLink to="/admin/san-pham-admin" className="sidebar-link text-decoration-none p-3">
          <i className="fas fa-box-open me-3"></i>
          <span className="hide-on-collapse">Sản phẩm</span>
        </NavLink>

        <NavLink to="/admin/nha-cung-cap-admin" className="sidebar-link text-decoration-none p-3">
          <i className="fas fa-truck me-3"></i>
          <span className="hide-on-collapse">Nhà cung cấp</span>
        </NavLink>

        <NavLink to="/admin/don-nhap-admin" className="sidebar-link text-decoration-none p-3">
          <i className="fas fa-file-import me-3"></i>
          <span className="hide-on-collapse">Đơn nhập</span>
        </NavLink>

        <NavLink to="/admin/don-xuat-admin" className="sidebar-link text-decoration-none p-3">
          <i className="fas fa-file-export me-3"></i>
          <span className="hide-on-collapse">Đơn xuất</span>
        </NavLink>

        <NavLink to="/admin/tai-khoan-admin" className="sidebar-link text-decoration-none p-3">
          <i className="fas fa-user-cog me-3"></i>
          <span className="hide-on-collapse">Tài khoản</span>
        </NavLink>
      </div>

      {/* Profile Info */}
      <div className="profile-section mt-auto p-4">
        <div className="d-flex align-items-center d-flex">
          <img
            src={userImg}
            style={{ height: "60px", width: "60px", objectFit: "cover" }}
            className="rounded-circle"
            alt="Profile"
          />
      
          <div className="ms-3 profile-info">
            <h6 className="text-white mb-0">{taiKhoan || "Admin"}</h6>
            <small className="text-light">Admin</small>
            
          </div>
              <div className="ms-3 d-flex flex-column">
       <Link to="/admin/ho-so-admin" className="text-decoration-none text-light d-block mt-2">
  <i className="fas fa-cog fa-spin fa-2xl" title="Cài đặt"></i>
</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SidebarAdmin;

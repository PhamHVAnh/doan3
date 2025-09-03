import React, { useState } from "react";
import "./Header.scss";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { brand } from "../../data/brand";
import TimKiemSanPham from "../../PD/search";
// import TimKiemSanPham from "../components/PD/search";

function Header() {
  const [showInfoMenu, setShowInfoMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [activeSubnav, setActiveSubnav] = useState(null);

  const handleMouseEnter = (index) => setActiveSubnav(index);
  const handleMouseLeave = () => setActiveSubnav(null);

  const [tuKhoa, setTuKhoa] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = tuKhoa.trim();
    if (trimmed !== "") {
      navigate(`/tim-kiem?tuKhoa=${encodeURIComponent(trimmed)}`);
      setTuKhoa(""); // Optional: xóa ô input
    }
  };
  const getCartCount = () => {
    try {
      const taiKhoan = localStorage.getItem("taiKhoan");
      const cartKey = taiKhoan ? `gioHang_${taiKhoan}` : "gioHang_tam";
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      return cart.reduce((sum, item) => sum + item.quantity, 0);
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Nếu có token thì đăng nhập
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("taiKhoan");
    setIsLoggedIn(false);
    navigate("/");
    window.location.reload(); // Đảm bảo cập nhật lại giao diện
  };
  const watchCategories = [
    {
      key: "nam",
      label: "ĐỒNG HỒ NAM",
      path: "/san-pham/nam",
      menu: {
        "THƯƠNG HIỆU": [
          "LONGINES",
          "TISSOT",
          "MIDO",
          "HAMILTON",
          "CERTINA",
          "MAURICE LACROIX",
          "FREDERIQUE CONSTANT",
          "CALVIN KLEIN",
        ],
        "MỨC GIÁ": [
          "DƯỚI 2 TRIỆU",
          "TỪ 2 TRIỆU ĐẾN 5 TRIỆU",
          "TỪ 5 TRIỆU ĐẾN 10 TRIỆU",
          "TỪ 10 TRIỆU ĐẾN 20 TRIỆU",
          "TỪ 20 TRIỆU ĐẾN 30 TRIỆU",
          "TỪ 30 TRIỆU ĐẾN 50 TRIỆU",
          "TỪ 50 TRIỆU ĐẾN 100 TRIỆU",
          "TRÊN 100 TRIỆU",
        ],
        "LOẠI MÁY": [
          "AUTOMATIC (MÁY CƠ TỰ ĐỘNG)",
          "QUARTZ (MÁY PIN – ĐIỆN TỬ)",
          "ECO-DRIVE (NĂNG LƯỢNG ÁNH SÁNG)",
          "QUARTZ CHRONOGRAPH",
          "AUTOMATIC CHRONOMETER",
          "QUARTZ CHRONOMETER (CHUẨN COSC)",
        ],
        "CHẤT LIỆU": [
          "TITANIUM",
          "VỎ MẠ PVD",
          "THÉP KHÔNG GỈ 316L",
          "THÉP KHÔNG GỈ 316L MẠ VÀNG PVD",
          "THÉP KHÔNG GỈ DẠNG LƯỚI MILANESE",
          "THÉP KHÔNG GỈ KẾT HỢP CERAMIC",
          "GỐM CERAMIC NGUYÊN KHỐI",
          "KIM LOẠI CAO CẤP",
        ],
      },
    },
    {
      key: "nu",
      label: "ĐỒNG HỒ NỮ",
      path: "/san-pham/nu",
      menu: {
        "THƯƠNG HIỆU": [
          "LONGINES",
          "TISSOT",
          "MIDO",
          "HAMILTON",
          "CERTINA",
          "MAURICE LACROIX",
          "FREDERIQUE CONSTANT",
          "CALVIN KLEIN",
        ],
        "MỨC GIÁ": [
          "DƯỚI 2 TRIỆU",
          "TỪ 2 TRIỆU ĐẾN 5 TRIỆU",
          "TỪ 5 TRIỆU ĐẾN 10 TRIỆU",
          "TỪ 10 TRIỆU ĐẾN 20 TRIỆU",
          "TỪ 20 TRIỆU ĐẾN 30 TRIỆU",
          "TỪ 30 TRIỆU ĐẾN 50 TRIỆU",
          "TỪ 50 TRIỆU ĐẾN 100 TRIỆU",
          "TRÊN 100 TRIỆU",
        ],
        "LOẠI MÁY": [
          "AUTOMATIC (MÁY CƠ TỰ ĐỘNG)",
          "QUARTZ (MÁY PIN – ĐIỆN TỬ)",
          "ECO-DRIVE (NĂNG LƯỢNG ÁNH SÁNG)",
          "QUARTZ CHRONOGRAPH",
          "AUTOMATIC CHRONOMETER",
          "QUARTZ CHRONOMETER (CHUẨN COSC)",
        ],
        "CHẤT LIỆU": [
          "TITANIUM",
           "VỎ MẠ PVD",
          "THÉP KHÔNG GỈ 316L",
          "THÉP KHÔNG GỈ 316L MẠ VÀNG PVD",
          "THÉP KHÔNG GỈ DẠNG LƯỚI MILANESE",
          "THÉP KHÔNG GỈ KẾT HỢP CERAMIC",
          "GỐM CERAMIC NGUYÊN KHỐI",
          "KIM LOẠI CAO CẤP",
        ],
      },
    },
    {
      key: "doi",
      label: "ĐỒNG HỒ ĐÔI",
      path: "/san-pham/doi",
      menu: {
        "THƯƠNG HIỆU": [
          "LONGINES",
          "TISSOT",
          "MIDO",
          "HAMILTON",
          "CERTINA",
          "MAURICE LACROIX",
          "FREDERIQUE CONSTANT",
          "CALVIN KLEIN",
        ],
        "MỨC GIÁ": [
          "DƯỚI 2 TRIỆU",
          "TỪ 2 TRIỆU ĐẾN 5 TRIỆU",
          "TỪ 5 TRIỆU ĐẾN 10 TRIỆU",
          "TỪ 10 TRIỆU ĐẾN 20 TRIỆU",
          "TỪ 20 TRIỆU ĐẾN 30 TRIỆU",
          "TỪ 30 TRIỆU ĐẾN 50 TRIỆU",
          "TỪ 50 TRIỆU ĐẾN 100 TRIỆU",
          "TRÊN 100 TRIỆU",
        ],
        "LOẠI MÁY": [
          "AUTOMATIC (MÁY CƠ TỰ ĐỘNG)",
          "QUARTZ (MÁY PIN – ĐIỆN TỬ)",
          "ECO-DRIVE (NĂNG LƯỢNG ÁNH SÁNG)",
          "QUARTZ CHRONOGRAPH",
          "AUTOMATIC CHRONOMETER",
          "QUARTZ CHRONOMETER (CHUẨN COSC)",
        ],
        "CHẤT LIỆU": [
          "TITANIUM",
          "VỎ MẠ PVD",
          "THÉP KHÔNG GỈ 316L",
          "THÉP KHÔNG GỈ 316L MẠ VÀNG PVD",
          "THÉP KHÔNG GỈ DẠNG LƯỚI MILANESE",
          "THÉP KHÔNG GỈ KẾT HỢP CERAMIC",
          "GỐM CERAMIC NGUYÊN KHỐI",
          "KIM LOẠI CAO CẤP",
        ],
      },
    },
  ];

  const menuKeyMap = {
    "THƯƠNG HIỆU": "thuonghieu",
    "MỨC GIÁ": "mucgia",
    "LOẠI MÁY": "loaimay",
    "CHẤT LIỆU": "chatlieu",
  };
  // const toQueryValue = (str) => {
  //   return str
  //     .replace(/\(.*?\)/g, "")
  //     .normalize("NFD")
  //     .replace(/[\u0300-\u036f]/g, "")
  //     .toLowerCase()
  //     .replace(/đ/g, "d");
  // };
const toQueryValue = (str) => {
  const isGiaTien = /(dưới|từ|trên|đến|triệu|giá|vnd|vnđ|đồng)/i.test(str);
  let s = str.replace(/\(.*?\)/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d");
  return isGiaTien ? s.replace(/\s+/g, "") : s;
};
  // function YourComponent() {
  //   const navigate = useNavigate();
  //   const [activeSubnav, setActiveSubnav] = React.useState(null);

  //   const handleMouseEnter = (idx) => setActiveSubnav(idx);
  //   const handleMouseLeave = () => setActiveSubnav(null);

  // }
  return (
    <>
      <header>
        <div className="container-fluid top-bar">
          <div className="row align-items-center">
            <div className="col-md-3 d-flex flex-column">
              <img
                src="/IMG/Logo.png"
                alt="Logo Việt Anh Watch"
                className="logo-img mb-2"
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="col-md-5">
              <TimKiemSanPham />
            </div>
            <div className="col-md-4 d-flex justify-content-end align-items-center gap-4">
              <div className="text-end d-flex align-items-center">
                <i
                  className="fa-sharp-duotone fa-solid fa-phone fa-shake fa-xl"
                  style={{ paddingRight: "10px" }}
                ></i>
                <div>
                  <div className="phone-text">GỌI NGAY</div>
                  <div className="phone-number">08.8386.8888</div>
                </div>
              </div>
              <div
                className="icon-circle"
                onClick={() => navigate("/dia-chi")}
                title="Vị trí cửa hàng"
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-geo-alt" title="Vị trí"></i>
              </div>
              <div className="icon-circle position-relative">
                <Link
                  to="/gio-hang"
                  title={
                    getCartCount() === 0
                      ? "Giỏ hàng của bạn đang trống"
                      : `Bạn có ${getCartCount()} sản phẩm chưa thanh toán`
                  }
                >
                  <i className="bi bi-cart"></i>
                  <span className="cart-badge">{getCartCount()}</span>
                </Link>
              </div>

              {/* Kiểm tra đăng nhập */}
              {isLoggedIn ? (
                <div
                  className="icon-circle position-relative"
                  style={{ cursor: "pointer" }}
                >
                  <i
                    class="fa-regular fa-arrow-right-to-bracket"
                    onClick={() => setShowInfoMenu(!showInfoMenu)}
                    style={{ margin: "0 auto", display: "block" }}
                  ></i>
                  {showInfoMenu && (
                    <div
                      className="info-dropdown"
                      style={{
                        position: "absolute",
                        top: "120%",
                        right: 0,
                        background: "#fff",
                        color: "#333",
                        minWidth: "180px",
                        borderRadius: "6px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        fontSize: "15px",
                        zIndex: 20,
                        padding: 0,
                        overflow: "hidden",
                      }}
                      onMouseLeave={() => setShowInfoMenu(false)}
                    >
                      <Link
                        to="/thong-tin"
                        style={{
                          display: "block",
                          padding: "10px 18px",
                          textDecoration: "none",
                          color: "#333",
                          borderBottom: "1px solid #eee",
                        }}
                        onClick={() => setShowInfoMenu(false)}
                      >
                        Thông tin tài khoản
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowInfoMenu(false);
                        }}
                        style={{
                          width: "100%",
                          background: "none",
                          border: "none",
                          padding: "10px 18px",
                          textAlign: "left",
                          color: "#c00",
                          cursor: "pointer",
                          fontSize: "15px",
                        }}
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="icon-circle">
                  <Link to="/dang-nhap">
                    <i className="fa-solid fa-user" title="Đăng nhâp"></i>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="navbar">
        <div className="subnav">
          <button
            className="subnavbtn home-btn text-light hover-white"
            onClick={() => navigate("/")}
          >
            <i className="fa fa-home"></i>
          </button>
        </div>

        <div
          className="subnav"
          onClick={() => {
            navigate("/thuong-hieu");
          }}
        >
          <button className="subnavbtn">THƯƠNG HIỆU</button>
          <div
            className="subnav-content"
            onClick={(e) => e.stopPropagation()}
            style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
          >
            {brand.map((b, index) => (
              <Link
                to={`/thuong-hieu/${b.slug}`}
                key={index}
                className="brand-card"
                style={{ textAlign: "center" }}
              >
                <img
                  src={b.icon} // Dùng url trực tiếp
                  alt={b.name}
                  style={{ width: "100px", objectFit: "contain" }}
                />
              </Link>
            ))}
          </div>
        </div>

        {watchCategories.map((category, idx) => (
          <div
            key={category.key}
            className="subnav"
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="subnavbtn"
              onClick={() => navigate(category.path)}
            >
              {category.label}
            </button>

            <div
              className="subnav-content"
              style={{ display: activeSubnav === idx ? "flex" : "none" }}
            >
              <div
                className="mega-menu"
                style={{ display: "flex", gap: "20px" }}
              >
                {Object.entries(category.menu).map(([menuTitle, items]) => (
                  <div key={menuTitle} className="column">
                    <h3>{menuTitle}</h3>
                    <ul>
                      {items.map((item, i) => (
                        <li
                          key={i}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            const paramKey = menuKeyMap[menuTitle];
                            const paramValue = toQueryValue(item);
                            navigate(
                              `${category.path}?${paramKey}=${paramValue}`
                            );
                          }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div
          className="subnav"
          onMouseEnter={() => handleMouseEnter(0)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="subnavbtn"
            onClick={() => navigate("/san-pham-khac")}
          >
            SẢN PHẨM KHÁC
          </button>

          <div
            className="subnav-content d-flex flex-column"
            style={{
              width: "200px",
              marginLeft: "260px",
              backgroundColor: "rgba(90, 68, 52, 0.95)",
            }}
          >
            <a href="#dong-ho-thuy-sy">Đồng hồ Thụy Sỹ</a>
            <a href="#dong-ho-nhat-ban">Đồng Hồ Nhật Bản</a>
            <a href="#trang-suc-dw">Trang sức DW</a>
            <a href="#day-deo-dong-ho">Dây đeo đồng hồ</a>
            <a href="#dong-ho-de-ban">Đồng hồ để bàn</a>
            <a href="#dong-ho-bao-thuc">Đồng hồ báo thức</a>
            <a href="#trang-suc-calvin-klein">Trang sức CALVIN KLEIN</a>
          </div>
        </div>

        <div
          className="subnav"
          onMouseEnter={() => handleMouseEnter(0)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="subnavbtn"
            onClick={() => {
              window.location.href = "/sua-chua";
            }}
          >
            SỬA CHỮA ĐỒNG HỒ
          </button>
        </div>
        <div
          className="subnav"
          onMouseEnter={() => handleMouseEnter(0)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="subnavbtn"
            onClick={() => {
              window.location.href = "/tin-tuc";
            }}
          >
            TIN TỨC
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;

import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import SidebarAdmin from "../SidebarAdmin";
import HeaderAdmin from "../HeaderAdmin";
import { getAllUsers } from "../../../services/nguoiDungService";

function LayoutAdmin() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [userImg, setUserImg] = useState("/uploads/1746625008031.jpg");
  const [taiKhoan, setTaiKhoan] = useState(localStorage.getItem("taiKhoan") || "Admin");

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const users = await getAllUsers();
        const user = users.find((u) => u.taiKhoan === taiKhoan);
        if (user?.anhThe?.length > 0) {
          setUserImg(`http://localhost:3002${user.anhThe[0]}`);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error.message);
      }
    };

    fetchUserData();
  }, [taiKhoan]);

  return (
    <div className={`container01 ${isSidebarOpen ? "" : "sidebar-collapsed"}`}>
      <SidebarAdmin collapsed={!isSidebarOpen} userImg={userImg} taiKhoan={taiKhoan} />
      <div className="main-wrapper">
        <HeaderAdmin toggleSidebar={toggleSidebar} userImg={userImg} taiKhoan={taiKhoan} />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default LayoutAdmin;

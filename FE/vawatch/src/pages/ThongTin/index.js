import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserById,
  updateUser,
  updatePassword,
  getRolegetById,
} from "../../services/nguoiDungService";
import { jwtDecode } from "jwt-decode";
import { getByUser } from "../../services/hoaDonBanService";
import "./thongTin.scss";
import { toast } from 'react-toastify';

// Hàm upload ảnh lên server, trả về URL ảnh
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

function ThongTin() {
  const [userData, setUserData] = useState(null);
  const [tenVT, setTenVT] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [hoaDons, setHoaDons] = useState([]);
  const [activeTab, setActiveTab] = useState("choDuyet");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const getProductImage = (images) => {
    if (Array.isArray(images) && images.length > 0) {
      return `http://localhost:3002${images[0]}`;
    }
    return null;
  };
  useEffect(() => {
    if (!token) return navigate("/dang-nhap");

    const fetchUser = async () => {
      try {
        const { maND } = jwtDecode(token);

        // Gọi API lấy thông tin user
        const user = await getUserById(maND);
        setUserData(user);

        // Gọi API lấy danh sách hóa đơn
        const hoaDonList = await getByUser(maND);
        setHoaDons(hoaDonList);

        // Gọi API lấy tên vai trò
        // if (user.maVT) {
        //   const role = await getRolegetById(user.maVT);
        //   setTenVT(role);
        // }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      }
    };

    fetchUser();
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateUser = async () => {
    try {
      let updatedUserData = { ...userData };

      if (selectedFile) {
        const imageUrl = await uploadImage(selectedFile);
        updatedUserData.anhThe = [imageUrl];
      }

      await updateUser(updatedUserData);
      toast.success("Cập nhật thành công!");
      // Cập nhật lại dữ liệu user để đồng bộ ảnh mới
      setUserData(updatedUserData);
      setSelectedFile(null);
    } catch (error) {
      toast.error("Lỗi cập nhật thông tin!");
      console.error(error);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPass || !newPass || newPass !== confirmPass) {
      return toast.warning("Vui lòng nhập đầy đủ và đúng mật khẩu.");
    }

    const taiKhoan = localStorage.getItem("taiKhoan");
    try {
      await updatePassword({
        taiKhoan,
        matKhauCu: currentPass,
        matKhauMoi: newPass,
      });
      toast.success("Đổi mật khẩu thành công!");
      localStorage.clear();
      navigate("/dang-nhap");
    } catch {
      toast.error("Đổi mật khẩu thất bại.");
    }
  };
  const handleHuyHoaDon = async (maHDB) => {
    const hoaDon = hoaDons.find((hd) => hd.maHDB === maHDB);
    if (!hoaDon) return toast.error("Không tìm thấy hóa đơn!");

    const updatedHoaDon = {
      maHDB: hoaDon.maHDB,
      ngayBan: hoaDon.ngayBan,
      trangThai: "Đã huỷ",
      giamGia: hoaDon.giamGia || 0,
      tongTien: hoaDon.tongTien,
      phuongThuc: hoaDon.phuongThuc,
      maND: hoaDon.maND,
      CTHoaDonBans: (hoaDon.CTHoaDonBans || []).map((ct) => ({
        ma_CTHDB: ct.ma_CTHDB,
        maSP: ct.maSP,
        soLuong: ct.soLuong,
        donGia: ct.donGia,
        thanhTien: ct.thanhTien,
      })),
    };

    try {
      const response = await fetch(
        "http://localhost:3002/api/hoadonban/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedHoaDon),
        }
      );

      if (!response.ok) throw new Error("Lỗi huỷ hóa đơn");

      toast.success("Đã huỷ hóa đơn thành công!");
      // Làm mới lại danh sách hóa đơn
      setHoaDons((prev) =>
        prev.map((hd) =>
          hd.maHDB === maHDB ? { ...hd, trangThai: "Đã huỷ" } : hd
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Không thể huỷ hóa đơn. Vui lòng thử lại.");
    }
  };

  // Tách hóa đơn theo trạng thái
  const hoaDonDaDuyet = hoaDons.filter((hd) => hd.trangThai === "Đã duyệt");
  const hoaDonChoDuyet = hoaDons.filter(
    (hd) => hd.trangThai === "Chờ duyệt" || hd.trangThai === "Đang xử lý"
  );
  const hoaDonDaHuy = hoaDons.filter((hd) => hd.trangThai === "Đã huỷ");

  if (!userData) return <p>Đang tải dữ liệu...</p>;

  return (
    <section className="ho-so-ne" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        <div className="row mb-4 align-items-center">
          <div className="col-12 col-md-8 mx-auto text-center">
            <h2 className="fw-bold mb-2" style={{ color: '#1a202c', letterSpacing: 1 }}>Tài khoản của bạn</h2>
            <div style={{ height: 4, width: 80, background: '#7c6a56', margin: '0 auto 16px auto', borderRadius: 2 }}></div>
            <p className="text-muted mb-0">Quản lý thông tin cá nhân và đơn hàng của bạn tại <span style={{ color: '#7c6a56', fontWeight: 600 }}>VA Watch</span></p>
          </div>
        </div>
        <div className="row g-4 align-items-start">
          {/* Thông tin tài khoản */}
          <div className="col-lg-4 col-md-5 col-12">
            <div className="card shadow border-0 p-4 position-relative" style={{ borderRadius: 18 }}>
              <div className="text-center mb-3">
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={
                      previewUrl ||
                      (userData.anhThe?.[0]
                        ? `http://localhost:3002${userData.anhThe[0]}`
                        : "/image/default.jpg")
                    }
                    className="img-thumbnail mb-2 shadow-sm"
                    alt="avatar"
                    style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: '50%', border: '4px solid #e0e7ef', background: '#fff' }}
                  />
                  <label htmlFor="upload-avatar" style={{ position: 'absolute', bottom: 8, right: 8, background: '#7c6a56', color: '#fff', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <i className="bi bi-camera"></i>
                    <input
                      id="upload-avatar"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setSelectedFile(file);
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="fw-bold mt-2" style={{ fontSize: 18 }}>{userData.tenND}</div>
                <div className="text-muted" style={{ fontSize: 14 }}>{userData.email}</div>
              </div>
              <div className="mb-2">
                <label className="form-label fw-bold">Số điện thoại</label>
                <input
                  id="sdt"
                  className="form-control"
                  value={userData.sdt}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="mb-2">
                <label className="form-label fw-bold">Địa chỉ nhận hàng</label>
                <input
                  id="diaChi"
                  className="form-control"
                  value={userData.diaChi}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ nhận hàng"
                />
              </div>
              <div className="mb-2">
                <label className="form-label fw-bold">Ngày tham gia</label>
                <input
                  className="form-control"
                  value={userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : ''}
                  disabled
                />
              </div>
              <div className="mb-2">
                <label className="form-label fw-bold"></label>
                <input
                  className="form-control"
                  value={tenVT?.tenVT || "Khách hàng"}
                  disabled
                />
              </div>
              <div className="d-flex flex-wrap gap-2 justify-content-center mt-3"
                  >
                <button className="btnsave" onClick={handleUpdateUser}
                >
                  Lưu thay đổi
                </button>
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                  {showPasswordForm ? "Ẩn đổi mật khẩu" : "Đổi mật khẩu"}
                </button>
              </div>
              {showPasswordForm && (
                <div className="mt-4 border-top pt-3">
                  <h5 className="mb-3">Đổi mật khẩu</h5>
                  <input
                    className="form-control mb-2"
                    placeholder="Mật khẩu cũ"
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="Mật khẩu mới"
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="Xác nhận mật khẩu mới"
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                  />
                  <button
                    className="btnsave w-100"
                    onClick={handleUpdatePassword}
                  >
                    Xác nhận đổi mật khẩu
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Thông tin đặt hàng */}
          <div className="col-lg-8 col-md-7 col-12">
            <div className="card shadow border-0 p-4" style={{ borderRadius: 18 }}>
              <div className="d-flex align-items-center mb-4">
                <i className="bi bi-bag-check" style={{ fontSize: 28, color: '#7c6a56', marginRight: 12 }}></i>
                <h4 className="mb-0 fw-bold" style={{ color: '#1a202c' }}>Lịch sử đơn hàng</h4>
              </div>
              <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                  <button
                    className={`nav-link${activeTab === "daDuyet" ? " active" : ""}`}
                    onClick={() => setActiveTab("daDuyet")}
                  >
                    Đã duyệt
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link${activeTab === "choDuyet" ? " active" : ""}`}
                    onClick={() => setActiveTab("choDuyet")}
                  >
                    Chờ duyệt/Đang xử lý
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link${activeTab === "daHuy" ? " active" : ""}`}
                    onClick={() => setActiveTab("daHuy")}
                  >
                    Đã huỷ
                  </button>
                </li>
              </ul>
              <div>
                {activeTab === "daDuyet" && (
                  hoaDonDaDuyet.length > 0 ? (
                    hoaDonDaDuyet.map((hd) => (
                      <div
                        key={hd.maHDB}
                        className="border rounded p-3 mb-3 shadow-sm bg-white position-relative"
                        style={{ borderLeft: '5px solid #28a745' }}
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-2"><span className="badge bg-success">Đã duyệt</span></div>
                            {/* <p className="mb-1"><strong>Mã hóa đơn:</strong> {hd.maHDB}</p> */}
                            <p className="mb-1"><strong>Ngày đặt:</strong> {new Date(hd.ngayBan).toLocaleDateString()}</p>
                            <p className="mb-1"><strong>Phương thức thanh toán:</strong> {hd.phuongThuc}</p>
                            <p className="mb-1"><strong>Địa chỉ nhận hàng:</strong> {hd.diaChi || userData.diaChi}</p>
                            <p className="mb-1"><strong>Tổng tiền:</strong> <span style={{ color: '#e53935', fontWeight: 600 }}>{hd.tongTien?.toLocaleString()} đ</span></p>
                          </div>
                          <div className="col-md-6">
                            <ul className="list-unstyled">
                              {hd.CTHoaDonBans?.map((ct) => (
                                <li
                                  key={ct.ma_CTHDB}
                                  className="d-flex align-items-center gap-3 mb-2 border-bottom pb-2"
                                >
                                  {ct.SanPham?.anhSP && ct.SanPham.anhSP.length > 0 && (
                                    <img
                                      src={getProductImage(ct.SanPham.anhSP)}
                                      alt={ct.SanPham.tenSP}
                                      className="img-thumbnail"
                                      style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: '1px solid #e0e7ef' }}
                                    />
                                  )}
                                  <div style={{ minWidth: 0 }}>
                                    <div className="fw-bold text-truncate" title={ct.SanPham?.tenSP}>
                                      <a
                                        href={`/chi-tiet/${ct.maSP}`}
                                        className="text-decoration-none text-dark"
                                        style={{ color: '#7c6a56', fontWeight: 600 }}
                                      >
                                        {ct.SanPham?.tenSP || "Sản phẩm"}
                                      </a>
                                    </div>
                                    <div className="text-muted" style={{ fontSize: 13 }}>Mã SP: {ct.maSP}</div>
                                    <div className="text-muted" style={{ fontSize: 13 }}>Số lượng: {ct.soLuong}</div>
                                    <div className="text-muted" style={{ fontSize: 13 }}>Đơn giá: {ct.donGia?.toLocaleString()} đ</div>
                                    <div className="text-danger" style={{ fontSize: 13 }}>Thành tiền: {ct.thanhTien?.toLocaleString()} đ</div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end align-items-center mt-2" style={{ fontSize: 13, color: '#1AC130' }}>
                          <i className="bi bi-clock-history me-1"></i>
                          Đã giao thành công
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Không có hóa đơn đã duyệt.</p>
                  )
                )}
                {activeTab === "choDuyet" && (
                  hoaDonChoDuyet.length > 0 ? (
                    hoaDonChoDuyet.map((hd) => (
                      <div
                        key={hd.maHDB}
                        className="border rounded p-3 mb-3 shadow-sm bg-white position-relative"
                        style={{ borderLeft: '5px solid #ffc107' }}
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-2"><span className="badge bg-warning text-dark">{hd.trangThai}</span></div>
                            {/* <p className="mb-1"><strong>Mã hóa đơn:</strong> {hd.maHDB}</p> */}
                            <p className="mb-1"><strong>Ngày đặt:</strong> {new Date(hd.ngayBan).toLocaleDateString()}</p>
                            <p className="mb-1"><strong>Phương thức thanh toán:</strong> {hd.phuongThuc}</p>
                            <p className="mb-1"><strong>Địa chỉ nhận hàng:</strong> {hd.diaChi || userData.diaChi}</p>
                            <p className="mb-1"><strong>Tổng tiền:</strong> <span style={{ color: '#e53935', fontWeight: 600 }}>{hd.tongTien?.toLocaleString()} đ</span></p>
                          </div>
                          <div className="col-md-6">
                            <ul className="list-unstyled">
                              {hd.CTHoaDonBans?.map((ct) => (
                                <li
                                  key={ct.ma_CTHDB}
                                  className="d-flex align-items-center gap-3 mb-2 border-bottom pb-2"
                                >
                                  {ct.SanPham?.anhSP && ct.SanPham.anhSP.length > 0 && (
                                    <img
                                      src={getProductImage(ct.SanPham.anhSP)}
                                      alt={ct.SanPham.tenSP}
                                      className="img-thumbnail"
                                      style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: '1px solid #e0e7ef' }}
                                    />
                                  )}
                                  <div style={{ minWidth: 0 }}>
                                    <div className="fw-bold text-truncate" title={ct.SanPham?.tenSP}>
                                      <a
                                        href={`/chi-tiet/${ct.maSP}`}
                                        className="text-decoration-none text-dark"
                                        style={{ color: '#7c6a56', fontWeight: 600 }}
                                      >
                                        {ct.SanPham?.tenSP || "Sản phẩm"}
                                      </a>
                                    </div>
                                    <div className="text-muted" style={{ fontSize: 13 }}>Mã SP: {ct.maSP}</div>
                                    <div className="text-muted" style={{ fontSize: 13 }}>Số lượng: {ct.soLuong}</div>
                                    <div className="text-muted" style={{ fontSize: 13 }}>Đơn giá: {ct.donGia?.toLocaleString()} đ</div>
                                    <div className="text-danger" style={{ fontSize: 13 }}>Thành tiền: {ct.thanhTien?.toLocaleString()} đ</div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end align-items-center mt-2" style={{ fontSize: 13, color: '#0d6efd' }}
>
                          <i className="bi bi-clock-history me-1"></i>
                          Đang chờ xử lý/giao hàng
                        </div>
                        <div className="text-end mt-2">
                          <button
                            className="btn btn-danger btn-sm px-3"
                            onClick={() => handleHuyHoaDon(hd.maHDB)}
                          >
                            Huỷ hóa đơn
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Không có hóa đơn chờ duyệt hoặc đang xử lý.</p>
                  )
                )}
                {activeTab === "daHuy" && (
                  hoaDonDaHuy.length > 0 ? (
                    hoaDonDaHuy.map((hd) => (
                      <div
                        key={hd.maHDB}
                        className="border rounded p-3 mb-3 shadow-sm bg-white position-relative"
                        style={{ borderLeft: '5px solid #e53935' }}
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-2"><span className="badge bg-danger">Đã huỷ</span></div>
                            {/* <p className="mb-1"><strong>Mã hóa đơn:</strong> {hd.maHDB}</p> */}
                            <p className="mb-1"><strong>Ngày đặt:</strong> {new Date(hd.ngayBan).toLocaleDateString()}</p>
                            <p className="mb-1"><strong>Phương thức thanh toán:</strong> {hd.phuongThuc}</p>
                            <p className="mb-1"><strong>Địa chỉ nhận hàng:</strong> {hd.diaChi || userData.diaChi}</p>
                            <p className="mb-1"><strong>Tổng tiền:</strong> <span style={{ color: '#e53935', fontWeight: 600 }}>{hd.tongTien?.toLocaleString()} đ</span></p>
                          </div>
                          <div className="col-md-6">
                            <ul className="list-unstyled">
                              {hd.CTHoaDonBans?.map((ct) => (
                                <li
                                  key={ct.ma_CTHDB}
                                  className="d-flex align-items-center gap-3 mb-2 border-bottom pb-2"
                                >
                                  {ct.SanPham?.anhSP && ct.SanPham.anhSP.length > 0 && (
                                    <img
                                      src={getProductImage(ct.SanPham.anhSP)}
                                      alt={ct.SanPham.tenSP}
                                      className="img-thumbnail"
                                      style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: '1px solid #e0e7ef' }}
                                    />
                                  )}
                                  <div style={{ minWidth: 0 }}>
                                    <div className="fw-bold text-truncate" title={ct.SanPham?.tenSP}>
                                      <a
                                        href={`/chi-tiet/${ct.maSP}`}
                                        className="text-decoration-none text-dark"
                                        style={{ color: '#7c6a56', fontWeight: 600 }}
                                      >
                                        {ct.SanPham?.tenSP || "Sản phẩm"}
                                      </a>
                                    </div>
                                    <div className="text-muted" style={{ fontSize: 13 }}>Mã SP: {ct.maSP}</div>
                                    <div className="text-muted" style={{ fontSize: 13 }}>Số lượng: {ct.soLuong}</div>
                                    <div className="text-muted" style={{ fontSize: 13 }}>Đơn giá: {ct.donGia?.toLocaleString()} đ</div>
                                    <div className="text-danger" style={{ fontSize: 13 }}>Thành tiền: {ct.thanhTien?.toLocaleString()} đ</div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end align-items-center mt-2" style={{ fontSize: 13, color: '#e53935' }}>
                          <i className="bi bi-x-octagon me-1"></i>
                          Đơn hàng đã huỷ
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Không có hóa đơn đã huỷ.</p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ThongTin;

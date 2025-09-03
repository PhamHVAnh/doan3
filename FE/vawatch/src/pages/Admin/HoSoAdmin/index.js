import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUser, updatePassword, getRolegetById } from "../../../services/nguoiDungService";
import { jwtDecode } from "jwt-decode";
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


function HoSoAdmin() {
  const [userData, setUserData] = useState(null);
  const [tenVT, setTenVT] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/dang-nhap");

    const fetchUser = async () => {
      try {
        const { maND } = jwtDecode(token);
        const user = await getUserById(maND);
        setUserData(user);

        if (user.maVT) {
          const role = await getRolegetById(user.maVT);
          setTenVT(role);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      }
    };
    fetchUser();
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserData(prev => ({ ...prev, [id]: value }));
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
      await updatePassword({ taiKhoan, matKhauCu: currentPass, matKhauMoi: newPass });
      toast.success("Đổi mật khẩu thành công!");
      localStorage.clear();
      navigate("/dang-nhap");
    } catch {
      toast.error("Đổi mật khẩu thất bại.");
    }
  };

  if (!userData) return <p>Đang tải dữ liệu...</p>;

  return (
    <section className="ho-so-ne">
      <div className="container">
        <h2 className="text-center mb-4">Hồ sơ cá nhân</h2>

        <div className="row">
          <div className="col-md-4 text-center">
            <img
              src={
                previewUrl || (userData.anhThe?.[0] ? `http://localhost:3002${userData.anhThe[0]}` : "/image/default.jpg")
              }
              className="img-thumbnail mb-2"
              alt="avatar"
            />
            <input
              type="file"
              accept="image/*"
              className="form-control mt-2"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
            />
          </div>

          <div className="col-md-8">
            <input id="tenND" className="form-control mb-2" value={userData.tenND} onChange={handleInputChange} />
            <input id="sdt" className="form-control mb-2" value={userData.sdt} onChange={handleInputChange} />
            <input id="email" className="form-control mb-2" value={userData.email} onChange={handleInputChange} />
            <input id="diaChi" className="form-control mb-2" value={userData.diaChi} onChange={handleInputChange} />
            <input className="form-control mb-2" readOnly value={`Chức vụ: Nhân viên`} />

            <button className="btn btn-primary me-2" onClick={handleUpdateUser}>
              Lưu thay đổi
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              {showPasswordForm ? "Ẩn đổi mật khẩu" : "Đổi mật khẩu"}
            </button>

            {showPasswordForm && (
              <div className="mt-4">
                <h5>Đổi mật khẩu</h5>
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
                <button className="btn btn-warning" onClick={handleUpdatePassword}>
                  Xác nhận đổi mật khẩu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HoSoAdmin;

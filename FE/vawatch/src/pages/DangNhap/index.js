import React, { useState } from "react";
import "./dangNhap.css";
import { login } from "../../services/authService";
import { createUser } from "../../services/nguoiDungService";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const DangNhap = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const [taiKhoan, setTaiKhoan] = useState("");
  const [matKhau, setMatKhau] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    handleLogin();
  }
};
  const handleLogin = async () => {
    setError("");
    if (!taiKhoan.trim() || !matKhau) {
      setError("Vui lòng nhập tài khoản và mật khẩu!");
      return;
    }
    try {
      const data = await login(taiKhoan.trim(), matKhau);
      localStorage.setItem("token", data.token);
      localStorage.setItem("taiKhoan", taiKhoan.trim());

      // Merge giỏ hàng tạm nếu có
      const tamCartStr = localStorage.getItem("gioHang_tam");
      if (tamCartStr) {
        const tamCart = JSON.parse(tamCartStr);
        const userCartStr =
          localStorage.getItem(`gioHang_${taiKhoan.trim()}`) || "[]";
        const userCart = JSON.parse(userCartStr);

        // Gộp 2 giỏ hàng (cộng số lượng nếu trùng id)
        const merged = [...userCart];
        tamCart.forEach((itemTam) => {
          const found = merged.find((item) => item.id === itemTam.id);
          if (found) {
            found.soLuong += itemTam.soLuong;
          } else {
            merged.push(itemTam);
          }
        });

        localStorage.setItem(
          `gioHang_${taiKhoan.trim()}`,
          JSON.stringify(merged)
        );
        localStorage.removeItem("gioHang_tam");
      }

      const tokenParts = data.token.split(".");
      const payload = JSON.parse(atob(tokenParts[1]));

      if (payload.maVT === "A00") navigate("/admin");
      else navigate("/");
      window.location.reload();
    } catch (err) {
      setError("Tài khoản hoặc mật khẩu không đúng");
    }
  };

  const handleRegister = async () => {
    setError("");

    if (
      !formData.username.trim() ||
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Vui lòng điền đầy đủ các trường!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    const user = {
      taiKhoan: formData.username.trim(),
      tenND: formData.fullName.trim(),
      email: formData.email.trim(),
      matKhau: formData.password,
      diaChi: "",
      ngaySinh: null,
      sdt: "",
    };

    try {
      await createUser(user);

      // Đăng nhập tự động
      const data = await login(user.taiKhoan, user.matKhau);
      localStorage.setItem("token", data.token);
      localStorage.setItem("taiKhoan", user.taiKhoan);

      const tokenParts = data.token.split(".");
      const payload = JSON.parse(atob(tokenParts[1]));

      if (payload.maVT === "A00") navigate("/admin");
      else navigate("/");
      window.location.reload();
    } catch (error) {
      setError("Lỗi: " + (error.response?.data?.error || error.message));
    }
    toast.success("Đăng ký thành công!");
  };

  return (
    <div className="container-lg">
      <div className="wrapper">
        <div className="title-text">
          <div className="title">{isSignup ? "Đăng Ký" : "Đăng Nhập"}</div>
        </div>

        <div className="slide-controls">
          <input
            type="radio"
            id="login"
            name="slide"
            checked={!isSignup}
            onChange={() => setIsSignup(false)}
          />
          <input
            type="radio"
            id="signup"
            name="slide"
            checked={isSignup}
            onChange={() => setIsSignup(true)}
          />
          <label htmlFor="login" className="slide login">
            Đăng Nhập
          </label>
          <label htmlFor="signup" className="slide signup">
            Đăng Ký
          </label>
          <div className="slider-tab"></div>
        </div>

        <div className="form-container">
          <div className="form-inner">
            {!isSignup && (
              <form
                className="login"
                onSubmit={(e) => e.preventDefault()}
                noValidate
              >
                <div className="field">
                  <input
                    type="text"
                    placeholder="Tài khoản"
                    value={taiKhoan}
                    onChange={(e) => setTaiKhoan(e.target.value)}
                      onKeyPress={handleKeyPress}
                    required
                  />
                </div>
                <div className="field">
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={matKhau}
                    onChange={(e) => setMatKhau(e.target.value)}
                      onKeyPress={handleKeyPress}
                    required
                  />
                </div>

                {error && <p className="text-danger text-center">{error}</p>}
                <div className="field btn">
                  <button type="button" onClick={handleLogin}>
                    Đăng Nhập
                  </button>
                </div>
                <div className="pass-link">
                  Bạn chưa có tài khoản?
                  <button
                    type="button"
                    onClick={() => setIsSignup((signup) => !signup)}
                    className="btn-link-fake"
                    style={{
                      color: "#7c6a56",
                      background: "none",
                      border: "none",
                      padding: 0,
                      marginLeft: 4,
                      cursor: "pointer",
                    }}
                  >
                    Đăng ký ngay
                  </button>
                </div>
              </form>
            )}

            {isSignup && (
              <form
                className="signup"
                onSubmit={(e) => e.preventDefault()}
                noValidate
              >
                <div className="field">
                  <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="field">
                  <input
                    type="text"
                    placeholder="Họ tên"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="field">
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="field">
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="field">
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                {error && <p className="text-danger text-center">{error}</p>}
                <div className="field btn">
                  <button type="button" onClick={handleRegister}>
                    Đăng Ký
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DangNhap;

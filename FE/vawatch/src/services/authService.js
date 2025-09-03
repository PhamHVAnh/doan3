import request from "../utils/request";

export const login = async (taiKhoan, matKhau) => {
  try {
    const response = await request.post("/login", { taiKhoan, matKhau });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Đăng nhập thất bại!";
  }
};

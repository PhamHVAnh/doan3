import request from "../utils/request";

export const getAllUsers = async () => {
  const response = await request.get("nguoidung/getall");
  return response.data;
};

export const getUserById = async (id) => {
  const response = await request.get(`nguoidung/getbyid/${id}`);
  return response.data;
};

export const createUser = async (data) => {
  const response = await request.post("nguoidung/insert", data);
  return response.data;
};

export const updateUser = async (data) => {
  const response = await request.put("nguoidung/update", data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await request.delete(`nguoidung/delete/${id}`);
  return response.data;
};

export const searchUser = async (query) => {
  const response = await request.get(`nguoidung/search?q=${query}`);
  return response.data;
};

export const getRolegetById = async (Quyen) => {
  const response = await request.get(`Quyen/getbyid/${Quyen}`);
  return response.data.Quyen;
};

export const updatePassword = async (data) => {
  const response = await request.patch("nguoidung/updatepassword", data);
  return response.data;
};
export const getByUser = async (maND) => {
  try {
    const response = await fetch(`http://localhost:3002/api/nguoidung/getbyuser/${maND}`);
    if (!response.ok) throw new Error("Không thể lấy thông tin người dùng chi tiết");
    return await response.json();
  } catch (error) {
    console.error("Lỗi getByUser:", error);
    return null;
  }
};

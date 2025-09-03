import request from "../utils/request";

export const getAllCtImport = async () => {
  const res = await request.get("/cthoadonnhap/getall");
  return res.data;
};

export const getCtImportById = async (id) => {
  const res = await request.get(`/cthoadonnhap/getbyid/${id}`);
  return res.data;
};

export const getAllImport = async () => {
  const res = await request.get("/hoadonnhap/getall");
  return res.data;
};

export const getImportById = async (id) => {
  const res = await request.get(`/hoadonnhap/getbyid/${id}`);
  return res.data;
};

export const insertImport = async (data) => {
  const res = await request.post("hoadonnhap/insert", data);
  return res.data;
};

export const updateImport = async (data) => {
  const res = await request.put("hoadonnhap/update", data);
  return res.data;
};

export const deleteImprot = async (id) => {
  const res = await request.delete(`/hoadonnhap/delete/${id}`);
  return res.data;
};

export const searchImprot = async (query) => {
  const response = await request.get(`hoadonnhap/search?q=${query}`);
  return response.data;
};

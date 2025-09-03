import request from "../utils/request";

export const getAllCtCategory = async () => {
  const response = await request.get("/danhmuc/getall");
  return response.data;
};

export const getCtCategoryById = async (id) => {
  const response = await request.get(`/danhmuc/getbyid/${id}`);
  return response.data;
};
export const getAllCategory = async () => {
  const response = await request.get("/danhmuc/getall");
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await request.get(`/danhmuc/getbyid/${id}`);
  return response.data;
};

export const insertCategory = async (data) => {
  const response = await request.post("danhmuc/insert", data);
  return response.data;
};
export const updateCategory = async (data) => {
  const response = await request.put("danhmuc/update", data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await request.delete(`danhmuc/delete/${id}`);
  return response.data;
};
export const searchCategory = async (query) => {
  const response = await request.get(`danhmuc/search?q=${query}`);
  return response.data;
};
export const searchSPtoCTDM = async (query) => {
  const response = await request.get(`danhmuc/search?q=${query}`);
  return response.data;
};

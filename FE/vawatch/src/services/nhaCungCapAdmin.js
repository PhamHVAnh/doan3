import request from "../utils/request";

export const getAllSuppliers = async () => {
  const response = await request.get("nhacungcap/getall");
  return response.data;
};

export const getSupplierById = async (id) => {
  const response = await request.get(`nhacungcap/getbyid/${id}`);
  return response.data;
};

export const createSupplier = async (data) => {
  const response = await request.post("nhacungcap/insert", data);
  return response.data;
};

export const updateSupplier = async (data) => {
  const response = await request.put("nhacungcap/update", data);
  return response.data;
};

export const deleteSupplier = async (id) => {
  const response = await request.delete(`nhacungcap/delete/${id}`);
  return response.data;
};

export const searchSuppliers = async (query) => {
  const response = await request.get(`nhacungcap/search?q=${query}`);
  return response.data;
};

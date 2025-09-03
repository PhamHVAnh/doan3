import request from "../utils/request";

export const getAllProducts = async () => {
  const response = await request.get("sanpham/getall");
  return response.data;
};
export const getAllProductsnam = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.thuonghieu) params.append("thuonghieu", filters.thuonghieu.join(","));
    if (filters.loaimay) params.append("loaimay", filters.loaimay.join(","));
    if (filters.chatlieu) params.append("chatlieu", filters.chatlieu.join(","));
    if (filters.xuatxu) params.append("xuatxu", filters.xuatxu.join(","));
    if (filters.kieudang) params.append("kieudang", filters.kieudang.join(","));
    if (filters.duongkinh) params.append("duongkinh", filters.duongkinh.join(","));
    if (filters.sizeday) params.append("sizeday", filters.sizeday.join(","));
    if (filters.chongnuoc) params.append("chongnuoc", filters.chongnuoc.join(","));
    if (filters.giamgia) params.append("giamgia", filters.giamgia);
    if (filters.mucgia) params.append("mucgia", filters.mucgia);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

    const response = await request.get("/sanpham/getallnam", { params });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm nam", error);
    return [];
  }
};
export const getAllProductsnu = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.thuonghieu) params.append("thuonghieu", filters.thuonghieu.join(","));
    if (filters.loaimay) params.append("loaimay", filters.loaimay.join(","));
    if (filters.chatlieu) params.append("chatlieu", filters.chatlieu.join(","));
    if (filters.xuatxu) params.append("xuatxu", filters.xuatxu.join(","));
    if (filters.kieudang) params.append("kieudang", filters.kieudang.join(","));
    if (filters.duongkinh) params.append("duongkinh", filters.duongkinh.join(","));
    if (filters.sizeday) params.append("sizeday", filters.sizeday.join(","));
    if (filters.chongnuoc) params.append("chongnuoc", filters.chongnuoc.join(","));
    if (filters.giamgia) params.append("giamgia", filters.giamgia);
    if (filters.mucgia) params.append("mucgia", filters.mucgia);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

    const response = await request.get("/sanpham/getallnu", { params });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm nữ", error);
    return [];
  }
};

export const getAllProductsdoi = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.thuonghieu) params.append("thuonghieu", filters.thuonghieu.join(","));
    if (filters.loaimay) params.append("loaimay", filters.loaimay.join(","));
    if (filters.chatlieu) params.append("chatlieu", filters.chatlieu.join(","));
    if (filters.xuatxu) params.append("xuatxu", filters.xuatxu.join(","));
    if (filters.kieudang) params.append("kieudang", filters.kieudang.join(","));
    if (filters.duongkinh) params.append("duongkinh", filters.duongkinh.join(","));
    if (filters.sizeday) params.append("sizeday", filters.sizeday.join(","));
    if (filters.chongnuoc) params.append("chongnuoc", filters.chongnuoc.join(","));
    if (filters.giamgia) params.append("giamgia", filters.giamgia);
    if (filters.mucgia) params.append("mucgia", filters.mucgia);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

    const response = await request.get("/sanpham/getalldoi", { params });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm đôi", error);
    return [];
  }
};



export const getProductById = async (id) => {
  const response = await request.get(`sanpham/getbyid/${id}`);
  return response.data;
};

export const createProduct = async (data) => {
  const response = await request.post("sanpham/insert", data);
  return response.data;
};

export const updateProduct = async (data) => {
  const response = await request.put("sanpham/update", data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await request.delete(`sanpham/delete/${id}`);
  return response.data;
};

export const searchProducts = async (query, categoryId) => {
  try {
    const params = new URLSearchParams();
    if (query) {
      params.append('q', query);
    }
    if (categoryId) {
      params.append('categoryId', categoryId);
    }
    const response = await request.get(`sanpham/search?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi tìm kiếm sản phẩm:", error);
    return [];
  }
};
export const filterProducts = async (filters) => {
  const response = await request.get("sanpham/filter", {
    params: filters,
  });
  return response.data;
};

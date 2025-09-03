import request from "../utils/request";

export const getAllImages = async () => {
  const res = await request.get("/images");
  return res.data;
};

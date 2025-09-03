const jwt = require("jsonwebtoken");
const NguoiDung = require("../models/nguoiDungModel");
const config = require("../config/config");
const md5 = require("md5");
exports.login = async (req, res) => {
  try {
    const { taiKhoan, matKhau } = req.body;
    const nguoiDung = await NguoiDung.findOne({ where: { taiKhoan } });

    if (!nguoiDung) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }
    const matKhauMd5 = md5(matKhau);
    const isMatch = matKhauMd5 === nguoiDung.matKhau;

    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { maND: nguoiDung.maND, maVT: nguoiDung.maVT },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

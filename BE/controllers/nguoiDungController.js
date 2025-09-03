const NguoiDung = require("../models/nguoiDungModel");
const { Op } = require("sequelize");
const md5 = require("md5");

exports.getAll = async (req, res) => {
  try {
    const nguoiDungs = await NguoiDung.findAll();
    res.status(200).json(nguoiDungs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const nguoiDung = await NguoiDung.findByPk(req.params.id);
    if (nguoiDung) {
      res.status(200).json(nguoiDung);
    } else {
      res.status(404).json({ message: "Người dùng không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.insert = async (req, res) => {
  try {
    let {
      tenND,
      diaChi = "",
      ngaySinh,
      sdt,
      email,
      taiKhoan,
      matKhau,
    } = req.body;

    // Nếu ngaySinh không hợp lệ hoặc null, set mặc định 2000-01-01
    if (!ngaySinh) ngaySinh = new Date("2000-01-01");

    // Nếu sdt không phải số hợp lệ, set mặc định 0 (hoặc thay đổi kiểu dữ liệu)
    if (!sdt || isNaN(Number(sdt))) sdt = 0;

    if (!tenND || !email || !taiKhoan || !matKhau) {
      return res.status(400).json({ error: "Thiếu trường bắt buộc" });
    }

    const nguoiDung = await NguoiDung.create({
      tenND,
      diaChi,
      ngaySinh,
      sdt,
      email,
      taiKhoan,
      matKhau,
      anhThe: "/uploads/1747723458569.png",
      maVT: "A01",
    });

    res.status(201).json(nguoiDung);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.update = async (req, res) => {
  try {
    const { maND, tenND, diaChi, ngaySinh, sdt, email, anhThe, maVT } =
      req.body;
    const nguoiDung = await NguoiDung.findByPk(maND);
    if (nguoiDung !== null) {
      await nguoiDung.update({
        tenND,
        diaChi,
        ngaySinh,
        sdt,
        email,
        anhThe,
        maVT,
      });
      res.status(200).json(nguoiDung);
    } else {
      res.status(404).json({ message: "Người dùng không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const nguoiDung = await NguoiDung.findByPk(req.params.id);
    if (nguoiDung) {
      await nguoiDung.destroy();
      res.status(200).json(nguoiDung);
    } else {
      res.status(404).json({ message: "Người dùng không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const nguoiDungs = await NguoiDung.findAll({
      where: {
        [Op.or]: [
          { tenND: { [Op.like]: `%${req.query.q}%` } },
          { diaChi: { [Op.like]: `%${req.query.q}%` } },
          { email: { [Op.like]: `%${req.query.q}%` } },
          { taiKhoan: { [Op.like]: `%${req.query.q}%` } },
        ],
      },
    });
    res.status(200).json(nguoiDungs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { taiKhoan, matKhauCu, matKhauMoi } = req.body;

    const nguoiDung = await NguoiDung.findOne({ where: { taiKhoan } });
    if (!nguoiDung) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Kiểm tra mật khẩu cũ
    if (nguoiDung.matKhau !== md5(matKhauCu)) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
    }

    // Cập nhật mật khẩu mới đã được mã hóa
    const matKhauMoiMd5 = md5(matKhauMoi);
    await nguoiDung.update({ matKhau: matKhauMoiMd5 });

    res.status(200).json({
      taiKhoan: nguoiDung.taiKhoan,
      matKhau: matKhauMoiMd5,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

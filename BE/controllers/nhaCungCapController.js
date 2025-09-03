const NhaCungCap = require("../models/nhaCungCapModel");
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const nhaCungCaps = await NhaCungCap.findAll();
    res.status(200).json(nhaCungCaps);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const nhaCungCap = await NhaCungCap.findByPk(req.params.id);
    if (nhaCungCap) {
      res.status(200).json(nhaCungCap);
    } else {
      res.status(404).json({ message: "Nhà cung cấp không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.insert = async (req, res) => {
  try {
    const { tenNCC, diaChi, sdt, email } = req.body;
    const nhaCungCap = await NhaCungCap.create({
      tenNCC,
      diaChi,
      sdt,
      email,
    });
    res.status(201).json(nhaCungCap);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { maNCC, tenNCC, diaChi, sdt, email } = req.body;
    const nhaCungCap = await NhaCungCap.findByPk(maNCC);
    if (nhaCungCap !== null) {
      await nhaCungCap.update({
        tenNCC,
        diaChi,
        sdt,
        email,
      });
      res.status(200).json(nhaCungCap);
    } else {
      res.status(404).json({ message: "Nhà cung cấp không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const nhaCungCap = await NhaCungCap.findByPk(req.params.id);
    if (nhaCungCap) {
      await nhaCungCap.destroy();
      res.status(200).json(nhaCungCap);
    } else {
      res.status(404).json({ message: "Nhà cung cấp không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const nhaCungCaps = await NhaCungCap.findAll({
      where: {
        [Op.or]: [
          { tenNCC: { [Op.like]: `%${req.query.q}%` } },
          { diaChi: { [Op.like]: `%${req.query.q}%` } },
          { email: { [Op.like]: `%${req.query.q}%` } },
          { sdt: { [Op.like]: `%${req.query.q}%` } },
        ],
      },
    });
    res.status(200).json(nhaCungCaps);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

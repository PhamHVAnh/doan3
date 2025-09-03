const db = require("../models");
const NguoiDung = require("../models/nguoiDungModel");
const VaiTro = require("../models/vaiTroModel");

exports.getAll = async (req, res) => {
  try {
    const vaiTros = await db.VaiTro.findAll({
      include: [
        {
          model: NguoiDung,
          as: "NguoiDungs",
        },
      ],
    });
    res.status(200).json(vaiTros);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const vaiTro = await db.VaiTro.findByPk(req.params.id, {
      include: [
        {
          model: NguoiDung,
          as: "NguoiDungs",
        },
      ],
    });
    if (vaiTro) {
      res.status(200).json(vaiTro);
    } else {
      res.status(404).json({ message: "Vai trò không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

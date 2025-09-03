const DanhMuc = require("../models/danhMucModel");
const SanPham = require("../models/sanPhamModel");
const { Op } = require("sequelize");

exports.getAllDM = async (req, res) => {
  try {
    const danhMucs = await DanhMuc.findAll({
      include: [
        {
          model: SanPham,
          as: "SanPhams",
        },
      ],
    });

    const result = danhMucs.map((dm) => ({
      maDM: dm.maDM,
      tenDM: dm.tenDM,
      SanPhams: dm.SanPhams,
    }));

    return res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getByIdDM = async (req, res) => {
  try {
    const danhMuc = await DanhMuc.findByPk(req.params.id, {
      include: [
        {
          model: SanPham,
          as: "SanPhams",
        },
      ],
    });
    if (danhMuc) {
      res.status(200).json({
        maDM: danhMuc.maDM,
        tenDM: danhMuc.tenDM,
        SanPhams: danhMuc.SanPhams,
      });
    } else {
      res.status(404).json({ message: "Chi tiết danh mục không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.insert = async (req, res) => {
  try {
    const { tenDM } = req.body;

    if (!tenDM) {
      return res.status(400).json({ error: "Tên chi tiết danh mục là bắt buộc" });
    }

    const newDanhMuc = await DanhMuc.create({ tenDM }); // Renamed variable to avoid conflict

    res.status(201).json(newDanhMuc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { maDM, tenDM } = req.body;

    if (!maDM) {
      return res.status(400).json({ error: "Mã chi tiết danh mục là bắt buộc" });
    }

    const existingDanhMuc = await DanhMuc.findByPk(maDM); // Renamed variable to avoid conflict
    if (!existingDanhMuc) {
      return res.status(404).json({ message: "Chi tiết danh mục không tồn tại" });
    }

    await existingDanhMuc.update({ tenDM });

    res.status(200).json(existingDanhMuc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const danhMuc = await DanhMuc.findByPk(id);  // ✅ sửa tên biến
    if (danhMuc) {
      await danhMuc.destroy();  // ✅ gọi destroy trên instance
      return res.status(200).json({ message: "Xóa thành công" });
    }

    res.status(404).json({ error: "Không tìm thấy danh mục" });
  } catch (error) {
    console.error("Lỗi xóa:", error); // để in log
    res.status(400).json({ error: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const { q } = req.query;

    const DanhMucs = await DanhMuc.findAll({
      where: { tenDM: { [Op.like]: `%${q}%` } },
      include: [{ model: SanPham, as: "SanPhams" }],
    });

    if (DanhMucs.length > 0) {
      return res.status(200).json(
        DanhMucs.map((dm) => ({
          ...dm.toJSON(),
          SanPhams: dm.SanPhams,
        }))
      );
    }

    res.status(404).json({ message: "Không tìm thấy kết quả phù hợp" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchDMOrSanPham = async (req, res) => {
  try {
    const { q } = req.query;

    // 1. Tìm chi tiết danh mục có tên giống từ khóa
    const DMs = await DanhMuc.findAll({
      where: { tenDM: { [Op.like]: `%${q}%` } },
      include: [
        {
          model: SanPham,
          as: "SanPhams",
        },
      ],
    });

    if (DMs.length > 0) {
      const result = DMs.map((dm) => ({
        maDM: dm.maDM,
        tenDM: dm.tenDM,
        SanPhams: dm.SanPhams,
      }));

      return res.status(200).json({ type: "DanhMuc", result });
    }


    const sanPhams = await SanPham.findAll({
      where: { tenSP: { [Op.like]: `%${q}%` } },
      include: [
        {
          model: DanhMuc,
          as: "DanhMuc",
          attributes: ["maDM", "tenDM"],
        },
      ],
    });

    if (sanPhams.length > 0) {
      const result = sanPhams.map((sp) => ({
        maSP: sp.maSP, // ID sản phẩm
        tenSP: sp.tenSP, // Tên sản phẩm
        giaTien: sp.giaTien, // Giá sản phẩm
        moTa: sp.moTa, // Mô tả sản phẩm
        anhSP: sp.anhSP, // Ảnh sản phẩm
        soLuong: sp.soLuong, // Số lượng sản phẩm
        giamGia: sp.giamGia, // Giảm giá (nếu có)
        Kieudang: sp.Kieudang, // Kiểu dáng sản phẩm
        Loaimay: sp.Loaimay, // Loại máy sản phẩm
        Duongkinh: sp.Duongkinh, // Đường kính sản phẩm
        Chatlieu: sp.Chatlieu, // Chất liệu sản phẩm
        Sizeday: sp.Sizeday, // Size dây sản phẩm

        DanhMuc: sp.DanhMuc,
      }));

      return res.status(200).json({ type: "SanPham", result });
    }

    return res.status(404).json({ message: "Không tìm thấy kết quả phù hợp" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
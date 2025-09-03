const SanPham = require("../models/sanPhamModel");
const DanhMuc = require("../models/danhMucModel");
const Sequelize = require("../config/database");
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const sanPhams = await SanPham.findAll({
      include: [{ model: DanhMuc, as: "DanhMuc" }],
    });
    res.status(200).json(sanPhams);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




const buildFilterQuery = (reqQuery, loaiTenSP) => {
  const {
    thuonghieu,
    loaimay,
    chatlieu,
    minPrice,
    maxPrice,
    mucgia,
    giamgia,
    chongnuoc,
    xuatxu,
    kieudang,
    duongkinh,
    sizeday,
  } = reqQuery;

  const where = {
    tenSP: {
      [Op.like]: `%${loaiTenSP}%`,
    },
  };

  if (thuonghieu) where.Thuonghieu = { [Op.in]: thuonghieu.split(",") };
  if (loaimay) where.Loaimay = { [Op.in]: loaimay.split(",") };
  if (chatlieu) where.Chatlieu = { [Op.in]: chatlieu.split(",") };
  if (xuatxu) where.Xuatxu = { [Op.in]: xuatxu.split(",") };
  if (kieudang) where.Kieudang = { [Op.in]: kieudang.split(",") };
  if (duongkinh) where.Duongkinh = { [Op.in]: duongkinh.split(",") };
  if (sizeday) where.Sizeday = { [Op.in]: sizeday.split(",") };
  if (chongnuoc) where.Chongnuoc = { [Op.in]: chongnuoc.split(",") };

  if (giamgia) {
    const normalized = giamgia.toLowerCase().replace(/\s+/g, "").replace(/%/g, "");
    switch (normalized) {
      case "dưới10":
      case "duoi10":
        where.giamGia = { [Op.lt]: 10 };
        break;
      case "10đến20":
      case "10den20":
        where.giamGia = { [Op.between]: [10, 20] };
        break;
      case "21đến30":
      case "21den30":
        where.giamGia = { [Op.between]: [21, 30] };
        break;
      case "31đến50":
      case "31den50":
        where.giamGia = { [Op.between]: [31, 50] };
        break;
      case "trên50":
      case "tren50":
        where.giamGia = { [Op.gt]: 50 };
        break;
    }
  }

  if (mucgia) {
    switch (mucgia.toLowerCase()) {
      case "dưới 2 triệu":
      case "duoi2trieu":
        where.giaTien = { [Op.lte]: 2000000 };
        break;
      case "từ 2 triệu đến 5 triệu":
      case "tu2trieuden5trieu":
        where.giaTien = { [Op.between]: [2000000, 5000000] };
        break;
      case "từ 5 triệu đến 10 triệu":
      case "tu5trieuden10trieu":
        where.giaTien = { [Op.between]: [5000000, 10000000] };
        break;
      case "từ 10 triệu đến 20 triệu":
      case "tu10trieuden20trieu":
        where.giaTien = { [Op.between]: [10000000, 20000000] };
        break;
      case "từ 20 triệu đến 30 triệu":
      case "tu20trieuden30trieu":
        where.giaTien = { [Op.between]: [20000000, 30000000] };
        break;
      case "từ 30 triệu đến 50 triệu":
      case "tu30trieuden50trieu":
        where.giaTien = { [Op.between]: [30000000, 50000000] };
        break;
      case "từ 50 triệu đến 100 triệu":
      case "tu50trieuden100trieu":
        where.giaTien = { [Op.between]: [50000000, 100000000] };
        break;
      case "trên 100 triệu":
      case "tren100trieu":
        where.giaTien = { [Op.gte]: 100000000 };
        break;
    }
  } else if (minPrice || maxPrice) {
    where.giaTien = {
      ...(minPrice && { [Op.gte]: parseFloat(minPrice) }),
      ...(maxPrice && { [Op.lte]: parseFloat(maxPrice) }),
    };
  }

  return where;
};

// Dùng cho đồng hồ nam
exports.getAllNam = async (req, res) => {
  try {
    const where = buildFilterQuery(req.query, "đồng hồ nam");
    const sanPhams = await SanPham.findAll({ where }); 
    res.status(200).json(sanPhams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lọc sản phẩm nam" });
  }
};


// Dùng cho đồng hồ nữ
exports.getAllNu = async (req, res) => {
  try {
    const where = buildFilterQuery(req.query, "đồng hồ nữ");
    const sanPhams = await SanPham.findAll({where});
    res.status(200).json(sanPhams);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllDoi = async (req, res) => {
  try {
    const where = buildFilterQuery(req.query, "đồng hồ đôi");
    const sanPhams = await SanPham.findAll({where});
    res.status(200).json(sanPhams);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getById = async (req, res) => {
  try {
    const sanPham = await SanPham.findByPk(req.params.id, {
      include: [{ model: DanhMuc, as: "DanhMuc" }],
    });
    if (sanPham) {
      res.status(200).json(sanPham);
    } else {
      res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.insert = async (req, res) => {
  try {
    const {
      tenSP,
      maDM,
Thuonghieu,
      Xuatxu,
      Kieudang,
      Loaimay,
      Duongkinh,
      Chatlieu,
      Sizeday,
      Chongnuoc,
      soLuong,
      giaTien,
      giamGia,
      anhSP,
    } = req.body;

    const anhSPArray = Array.isArray(anhSP) ? anhSP : [anhSP];

    const sanPham = await SanPham.create({
      tenSP,
      maDM,
      Thuonghieu,
      Xuatxu,
      Kieudang,
      Loaimay,
      Duongkinh,
      Chatlieu,
      Sizeday,
      Chongnuoc,
      soLuong,
      giaTien,
      giamGia,
      anhSP,
    });

    res.status(201).json(sanPham);
  } catch (error) {
    console.log(error); 
    res.status(400).json({ error: error.message });
  }
};


exports.update = async (req, res) => {
  try {
    const {
      maSP,
      tenSP,
      maDM,
       Thuonghieu,
      Xuatxu,
      Kieudang,
      Loaimay,
      Duongkinh,
      Chatlieu,
      Sizeday,
      Chongnuoc,
      soLuong,
      giaTien,
      giamGia,
      anhSP,
    } = req.body;

    const sanPham = await SanPham.findByPk(maSP);

    if (sanPham) {
      await sanPham.update({
        tenSP,
        maDM,
         Thuonghieu,
        Xuatxu,
        Kieudang,
        Loaimay,
        Duongkinh,
        Chatlieu,
        Sizeday,
        Chongnuoc,
        soLuong,
        giaTien,
        giamGia,
        anhSP,
      });
      res.status(200).json(sanPham);
    } else {
      res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const sanPham = await SanPham.findByPk(req.params.id);
    if (sanPham) {
      await sanPham.destroy();
      res.status(200).json(sanPham);
    } else {
      res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const { q, categoryId } = req.query;
    const where = {};

    if (q) {
      where.tenSP = { [Op.like]: `%${q}%` };
    }

    if (categoryId) {
      where.maDM = categoryId;
    }

    const sanPhams = await SanPham.findAll({
      where,
      include: [{ model: DanhMuc, as: "DanhMuc" }],
    });
    res.status(200).json(sanPhams);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// GET /api/sanpham/filter

exports.Filter = async (req, res) => {
  try {
    const {
      thuonghieu,
      loaimay,
      chatlieu,
      minPrice,
      maxPrice,
    } = req.query;

    const where = {};

    if (thuonghieu) {
      where.Thuonghieu = { [Op.in]: thuonghieu.split(",") };
    }

    if (loaimay) {
      where.Loaimay = { [Op.in]: loaimay.split(",") };
    }

    if (chatlieu) {
      where.Chatlieu = { [Op.in]: chatlieu.split(",") };
    }

    if (minPrice || maxPrice) {
      where.giaTien = {
        ...(minPrice && { [Op.gte]: parseFloat(minPrice) }),
        ...(maxPrice && { [Op.lte]: parseFloat(maxPrice) }),
      };
    }

    const products = await SanPham.findAll({ where });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lọc sản phẩm" });
  }
};

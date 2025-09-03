const HoaDonBan = require("../models/hoaDonBanModel");
const CTHoaDonBan = require("../models/ctHoaDonBanModel");
const SanPham = require("../models/sanPhamModel");
const NguoiDung = require("../models/nguoiDungModel");
const { Op, Sequelize } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const hoaDonBans = await HoaDonBan.findAll({
      include: [
        {
          model: NguoiDung,
          as: "NguoiDung",
          attributes: ["tenND", "sdt", "email", "diaChi"],
        },
        {
          model: CTHoaDonBan,
          as: "CTHoaDonBans",
          include: [
            {
              model: SanPham,
              as: "SanPham",
              attributes: ["tenSP", "anhSP"],
            },
          ],
        },
      ],
    });

    res.status(200).json(hoaDonBans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const hoaDonBan = await HoaDonBan.findByPk(id, {
      include: [
        {
          model: NguoiDung,
          as: "NguoiDung",
          attributes: ["tenND", "sdt", "email", "diaChi"],
        },
        {
          model: CTHoaDonBan,
          as: "CTHoaDonBans",
          include: [
            {
              model: SanPham,
              as: "SanPham",
              attributes: ["tenSP", "anhSP"],
            },
          ],
        },
      ],
    });

    if (!hoaDonBan) {
      return res.status(404).json({ error: "Hóa đơn bán không tồn tại" });
    }

    res.status(200).json(hoaDonBan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCTHDB = async (req, res) => {
  try {
    const chiTietHoaDonBans = await CTHoaDonBan.findAll({
      include: [
        {
          model: SanPham,
          as: "SanPham",
          attributes: ["tenSP", "anhSP"],
        },
      ],
    });

    res.status(200).json(chiTietHoaDonBans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByIdCTHDB = async (req, res) => {
  try {
    const chiTietHoaDonBan = await CTHoaDonBan.findByPk(req.params.id, {
      include: [
        {
          model: SanPham,
          as: "SanPham",
          attributes: ["tenSP", "anhSP"],
        },
      ],
    });

    if (!chiTietHoaDonBan) {
      return res.status(404).json({ error: "Chi tiết hóa đơn không tồn tại" });
    }

    res.status(200).json(chiTietHoaDonBan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.insert = async (req, res) => {
  try {
    const { maHDB, giamGia, phuongThuc, maND, ghiChu, CTHoaDonBans } = req.body;
    let hoaDonBan;
    if (maHDB) {
      hoaDonBan = await HoaDonBan.findByPk(maHDB, {
        include: [{ model: CTHoaDonBan, as: "CTHoaDonBans" }],
      });

      if (!hoaDonBan) {
        return res.status(404).json({ error: "Hóa đơn bán không tồn tại" });
      }
    } else {
      // Nếu chưa có thì tạo mới
      if (!phuongThuc || !maND) {
        return res
          .status(400)
          .json({ error: "Thiếu thông tin bắt buộc để tạo hóa đơn bán" });
      }

      hoaDonBan = await HoaDonBan.create({
        ngayBan: new Date(),
        trangThai: "Chờ duyệt",
        giamGia: giamGia || 0,
        tongTien: 0,
        phuongThuc,
        maND,
        ghiChu,
      });
    }

    // Xử lý từng chi tiết hóa đơn
    if (Array.isArray(CTHoaDonBans)) {
      for (const chiTiet of CTHoaDonBans) {
        const sanPham = await SanPham.findByPk(chiTiet.maSP);

        if (!sanPham) {
          throw new Error(`Sản phẩm với mã ${chiTiet.maSP} không tồn tại`);
        }

        if (sanPham.soLuong < chiTiet.soLuong) {
          throw new Error(`Sản phẩm ${sanPham.tenSP} không đủ hàng trong kho`);
        }

        // Trừ số lượng trong kho
        await sanPham.decrement("soLuong", { by: chiTiet.soLuong });

        // Kiểm tra sản phẩm đã tồn tại trong chi tiết hóa đơn chưa
        const chiTietTonTai = await CTHoaDonBan.findOne({
          where: {
            maHDB: hoaDonBan.maHDB,
            maSP: chiTiet.maSP,
          },
        });

        if (chiTietTonTai) {
          // Nếu đã có, cộng dồn số lượng và cập nhật thành tiền
          const soLuongMoi = chiTietTonTai.soLuong + chiTiet.soLuong;
          const thanhTienMoi = soLuongMoi * sanPham.giaTien;

          await chiTietTonTai.update({
            soLuong: soLuongMoi,
            thanhTien: thanhTienMoi,
          });
        } else {
          // Nếu chưa có, tạo mới chi tiết hóa đơn
          await CTHoaDonBan.create({
            maHDB: hoaDonBan.maHDB,
            maSP: chiTiet.maSP,
            soLuong: chiTiet.soLuong,
            donGia: sanPham.giaTien,
            thanhTien: chiTiet.soLuong * sanPham.giaTien,
          });
        }
      }
    }

    // Tính lại tổng tiền
    const tongThanhTien = await CTHoaDonBan.sum("thanhTien", {
      where: { maHDB: hoaDonBan.maHDB },
    });

    const tongSauGiam = Math.max(tongThanhTien - (hoaDonBan.giamGia || 0), 0);
    await hoaDonBan.update({ tongTien: tongSauGiam });

    // Trả về hóa đơn sau khi cập nhật
    const updatedHoaDonBan = await HoaDonBan.findByPk(hoaDonBan.maHDB, {
      include: [{ model: CTHoaDonBan, as: "CTHoaDonBans" }],
    });

    res.status(201).json(updatedHoaDonBan);
  } catch (error) {
    console.error("Lỗi tạo/cập nhật hóa đơn:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { maHDB, trangThai } = req.body;
    const hoaDon = await HoaDonBan.findByPk(maHDB);
    if (hoaDon !== null) {
      await hoaDon.update({ trangThai });
      const updatedHoaDonBan = await HoaDonBan.findByPk(maHDB, {
        include: [{ model: CTHoaDonBan, as: "CTHoaDonBans" }],
      });
      res.status(200).json(updatedHoaDonBan);
    } else {
      res.status(404).json({ message: "Hóa đơn không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Nếu là chi tiết hóa đơn
    const chiTiet = await CTHoaDonBan.findByPk(id);
    if (chiTiet) {
      await SanPham.increment("soLuong", {
        by: chiTiet.soLuong,
        where: { maSP: chiTiet.maSP },
      });

      const maHDB = chiTiet.maHDB;
      await chiTiet.destroy();

      // Tính lại tổng tiền nếu còn chi tiết
      const tongTien = await CTHoaDonBan.sum("thanhTien", { where: { maHDB } });
      await HoaDonBan.update({ tongTien: tongTien || 0 }, { where: { maHDB } });

      return res.status(200).json(chiTiet);
    }

    // Nếu là hóa đơn bán
    const hoaDon = await HoaDonBan.findByPk(id, {
      include: [{ model: CTHoaDonBan, as: "CTHoaDonBans" }],
    });
    if (!hoaDon) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy hóa đơn bán hoặc chi tiết" });
    }

    await Promise.all(
      hoaDon.CTHoaDonBans.map((ct) =>
        SanPham.increment("soLuong", {
          by: ct.soLuong,
          where: { maSP: ct.maSP },
        })
      )
    );

    await CTHoaDonBan.destroy({ where: { maHDB: id } });
    await hoaDon.destroy();

    return res.status(200).json(hoaDon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const keyword = req.query.q || "";

    const hoaDonBans = await HoaDonBan.findAll({
      include: [
        {
          model: CTHoaDonBan,
          as: "CTHoaDonBans",
        },
        {
          model: NguoiDung,
          as: "NguoiDung",
          required: false,
        },
      ],
      where: {
        [Op.or]: [
          Sequelize.where(Sequelize.col("NguoiDung.tenND"), {
            [Op.like]: `%${keyword}%`,
          }),
          Sequelize.where(Sequelize.fn("DATE", Sequelize.col("ngayBan")), {
            [Op.like]: `%${keyword}%`,
          }),
          { tongTien: { [Op.like]: `%${keyword}%` } },
        ],
      },
    });

    res.status(200).json(hoaDonBans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.getByUser = async (req, res) => {
  try {
    const { maND } = req.params;

    const hoaDonBans = await HoaDonBan.findAll({
      where: { maND: maND },
      include: [
        // {
        //   model: NguoiDung,
        //   as: "NguoiDung",
        //   attributes: ["tenND", "sdt", "email", "diaChi"],
        // },
        {
          model: CTHoaDonBan,
          as: "CTHoaDonBans",
          include: [
            {
              model: SanPham,
              as: "SanPham",
              attributes: ["tenSP", "anhSP"],
            },
          ],
        },
      ],
    });

    if (!hoaDonBans || hoaDonBans.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy hóa đơn bán của người dùng này" });
    }

    res.status(200).json(hoaDonBans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

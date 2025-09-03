const HoaDonNhap = require("../models/hoaDonNhapModel");
const CTHoaDonNhap = require("../models/ctHoaDonNhapModel");
const SanPham = require("../models/sanPhamModel");
const NguoiDung = require("../models/nguoiDungModel");
const NhaCungCap = require("../models/nhaCungCapModel");

const { Op, Sequelize } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const hoaDonNhaps = await HoaDonNhap.findAll({
      include: [
        {
          model: NguoiDung,
          as: "NguoiDung",
          attributes: ["tenND"],
        },
        {
          model: NhaCungCap,
          as: "NhaCungCap",
          attributes: ["tenNCC", "sdt", "diaChi"],
        },
        {
          model: CTHoaDonNhap,
          as: "CTHoaDonNhaps",
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

    res.status(200).json(hoaDonNhaps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const hoaDonNhap = await HoaDonNhap.findByPk(id, {
      include: [
        {
          model: NguoiDung,
          as: "NguoiDung",
          attributes: ["tenND"],
        },
        {
          model: NhaCungCap,
          as: "NhaCungCap",
          attributes: ["tenNCC", "sdt", "diaChi"],
        },
        {
          model: CTHoaDonNhap,
          as: "CTHoaDonNhaps",
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

    if (!hoaDonNhap) {
      return res.status(404).json({ error: "Hóa đơn nhập không tồn tại" });
    }

    res.status(200).json(hoaDonNhap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCTHDN = async (req, res) => {
  try {
    const chiTietHoaDonNhaps = await CTHoaDonNhap.findAll({
      include: [
        {
          model: SanPham,
          as: "SanPham",
          attributes: ["tenSP", "anhSP"],
        },
      ],
    });

    res.status(200).json(chiTietHoaDonNhaps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByIdCTHDN = async (req, res) => {
  try {
    const chiTietHoaDonNhap = await CTHoaDonNhap.findByPk(req.params.id, {
      include: [
        {
          model: SanPham,
          as: "SanPham",
          attributes: ["tenSP", "anhSP"],
        },
      ],
    });

    if (!chiTietHoaDonNhap) {
      return res.status(404).json({ error: "Chi tiết hóa đơn không tồn tại" });
    }

    res.status(200).json(chiTietHoaDonNhap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.insert = async (req, res) => {
  try {
    const { maHDN, giamGia, phuongThuc, maND, maNCC, CTHoaDonNhaps } = req.body;
    let hoaDonNhap;

    if (maHDN) {
      //
      hoaDonNhap = await HoaDonNhap.findByPk(maHDN, {
        include: [{ model: CTHoaDonNhap, as: "CTHoaDonNhaps" }],
      });

      if (!hoaDonNhap) {
        return res.status(404).json({ error: "Hóa đơn nhập không tồn tại" });
      }
    } else {
      // không có maHDN, tạo hóa đơn mới
      if (!phuongThuc || !maND || !maNCC) {
        return res
          .status(400)
          .json({ error: "Thiếu thông tin bắt buộc để tạo hóa đơn nhập" });
      }

      hoaDonNhap = await HoaDonNhap.create({
        ngayNhap: new Date(),
        giamGia: giamGia || 0,
        tongTien: 0,
        phuongThuc,
        maND,
        maNCC,
      });
    }

    // danh sách chi tiết thêm vào bảng CTHoaDonNhap
    if (CTHoaDonNhaps && Array.isArray(CTHoaDonNhaps)) {
      await Promise.all(
        CTHoaDonNhaps.map(async (chiTiet) => {
          // Kiểm tra sản phẩm có tồn tại không
          const sanPham = await SanPham.findByPk(chiTiet.maSP);
          if (!sanPham) {
            throw new Error(`Sản phẩm ${chiTiet.maSP} không tồn tại`);
          }
          // Kiểm tra giá nhập < giá sản phẩm
          if (chiTiet.donGia >= sanPham.giaTien) {
            throw new Error(
              `Giá nhập (${chiTiet.donGia}) phải nhỏ hơn giá hiện tại của sản phẩm (${sanPham.giaTien})`
            );
          }
          // Thêm chi tiết hóa đơn nhập
          await CTHoaDonNhap.create({
            maSP: chiTiet.maSP,
            maHDN: hoaDonNhap.maHDN,
            soLuong: chiTiet.soLuong,
            donGia: chiTiet.donGia,
            thanhTien: chiTiet.soLuong * chiTiet.donGia,
          });

          // Cập nhật số lượng sản phẩm trong bảng SanPham
          await sanPham.increment("soLuong", { by: chiTiet.soLuong });
        })
      );
    }

    //  tổng tiền sau khi thêm chi tiết
    const tongTienMoi = await CTHoaDonNhap.sum("thanhTien", {
      where: { maHDN: hoaDonNhap.maHDN },
    });
    const tongTienSauGiam = Math.max(
      tongTienMoi - (hoaDonNhap.giamGia || 0),
      0
    );

    await hoaDonNhap.update({ tongTien: tongTienSauGiam });

    //
    const updatedHoaDonNhap = await HoaDonNhap.findByPk(hoaDonNhap.maHDN, {
      include: [{ model: CTHoaDonNhap, as: "CTHoaDonNhaps" }],
    });

    res.status(201).json(updatedHoaDonNhap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { maHDN, ngayNhap, giamGia, phuongThuc, maND, maNCC, CTHoaDonNhaps } =
      req.body;
    //
    const hoaDonNhap = await HoaDonNhap.findByPk(maHDN, {
      include: [{ model: CTHoaDonNhap, as: "CTHoaDonNhaps" }],
    });

    if (!hoaDonNhap) {
      return res.status(404).json({ error: "Hóa đơn nhập không tồn tại" });
    }

    // Cập nhật thông tin
    await hoaDonNhap.update({
      ngayNhap,
      giamGia,
      phuongThuc,
      maND,
      maNCC,
    });

    // có danh sách chi tiết cập nhật từng mục
    if (CTHoaDonNhaps && Array.isArray(CTHoaDonNhaps)) {
      await Promise.all(
        CTHoaDonNhaps.map(async (chiTiet) => {
          const { ma_CTHDN, maSP, soLuong, donGia } = chiTiet;
          //
          const chiTietHDN = await CTHoaDonNhap.findOne({
            where: { ma_CTHDN, maHDN },
          });

          if (chiTietHDN) {
            const chenhLechSoLuong = soLuong - chiTietHDN.soLuong;
            // Cập nhật chi tiết
            await chiTietHDN.update({
              maSP,
              soLuong,
              donGia,
              thanhTien: soLuong * donGia,
            });

            // Cập nhật số lượng sản phẩm trong bảng SanPham
            const sanPham = await SanPham.findByPk(maSP);
            if (sanPham) {
              await sanPham.increment("soLuong", { by: chenhLechSoLuong });
            }
          }
        })
      );
    }

    const tongTienMoi = await CTHoaDonNhap.sum("thanhTien", {
      where: { maHDN },
    });
    const tongTienSauGiam = Math.max(tongTienMoi - (giamGia || 0), 0);
    await hoaDonNhap.update({ tongTien: tongTienSauGiam });

    //
    const updatedHoaDonNhap = await HoaDonNhap.findByPk(maHDN, {
      include: [{ model: CTHoaDonNhap, as: "CTHoaDonNhaps" }],
    });

    res.status(200).json(updatedHoaDonNhap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Nếu là chi tiết hóa đơn
    const chiTiet = await CTHoaDonNhap.findByPk(id);
    if (chiTiet) {
      await SanPham.decrement("soLuong", {
        by: chiTiet.soLuong,
        where: { maSP: chiTiet.maSP },
      });

      const maHDN = chiTiet.maHDN;
      await chiTiet.destroy();

      // Tính lại tổng tiền nếu còn chi tiết
      const tongTien = await CTHoaDonNhap.sum("thanhTien", {
        where: { maHDN },
      });
      await HoaDonNhap.update(
        { tongTien: tongTien || 0 },
        { where: { maHDN } }
      );

      return res.status(200).json(chiTiet);
    }

    // Nếu là hóa đơn bán
    const hoaDon = await HoaDonNhap.findByPk(id, {
      include: [{ model: CTHoaDonNhap, as: "CTHoaDonNhaps" }],
    });
    if (!hoaDon) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy hóa đơn bán hoặc chi tiết" });
    }

    await Promise.all(
      hoaDon.CTHoaDonNhaps.map((ct) =>
        SanPham.increment("soLuong", {
          by: ct.soLuong,
          where: { maSP: ct.maSP },
        })
      )
    );

    await CTHoaDonNhap.destroy({ where: { maHDN: id } });
    await hoaDon.destroy();

    return res.status(200).json(hoaDon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const keyword = req.query.q || "";

    const hoaDonNhaps = await HoaDonNhap.findAll({
      include: [
        {
          model: CTHoaDonNhap,
          as: "CTHoaDonNhaps",
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
          Sequelize.where(Sequelize.fn("DATE", Sequelize.col("ngayNhap")), {
            [Op.like]: `%${keyword}%`,
          }),
          { tongTien: { [Op.like]: `%${keyword}%` } },
        ],
      },
    });

    res.status(200).json(hoaDonNhaps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

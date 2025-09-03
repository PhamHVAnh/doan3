const sequelize = require("../config/database");
const DanhMuc = require("./danhMucModel");
const SanPham = require("./sanPhamModel");
const VaiTro = require("./vaiTroModel");
const NguoiDung = require("./nguoiDungModel");
const NhaCungCap = require("./nhaCungCapModel");
const HoaDonNhap = require("./hoaDonNhapModel");
const CTHoaDonNhap = require("./ctHoaDonNhapModel");
const HoaDonBan = require("./hoaDonBanModel");
const CTHoaDonBan = require("./ctHoaDonBanModel");
// const CTDanhMuc = require("./ctDanhMucModel");

const db = {
  DanhMuc,
  SanPham,
  VaiTro,
  NguoiDung,
  NhaCungCap,
  HoaDonNhap,
  CTHoaDonNhap,
  HoaDonBan,
  CTHoaDonBan,

};

// Thiết lập các mối quan hệ
Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;

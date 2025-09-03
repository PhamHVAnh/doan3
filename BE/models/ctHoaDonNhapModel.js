const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CTHoaDonNhap = sequelize.define(
  "CT_HoaDonNhap",
  {
    ma_CTHDN: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    maHDN: {
      type: DataTypes.UUID,
      references: {
        model: "HoaDonNhap",
        key: "maHDN",
      },
      allowNull: false,
    },
    maSP: {
      type: DataTypes.UUID,
      references: {
        model: "SanPham",
        key: "maSP",
      },
      allowNull: false,
    },
    soLuong: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    donGia: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    thanhTien: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    tableName: "CT_HoaDonNhap",
  }
);

CTHoaDonNhap.associate = (models) => {
  CTHoaDonNhap.belongsTo(models.HoaDonNhap, {
    foreignKey: "maHDN",
    as: "HoaDonNhap",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  CTHoaDonNhap.belongsTo(models.SanPham, {
    foreignKey: "maSP",
    as: "SanPham",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

module.exports = CTHoaDonNhap;

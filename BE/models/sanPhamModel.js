const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const CT_HoaDonNhap = require("./ctHoaDonNhapModel");
const CT_HoaDonBan = require("./ctHoaDonBanModel");

const SanPham = sequelize.define(
  "SanPham",
  {
    maSP: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    maDM: {
      type: DataTypes.UUID,
      references: {
        model: "DanhMuc",
        key: "maDM",
      },
      allowNull: false,
    },
    tenSP: {
      type: DataTypes.STRING,
      allowNull: false,
    },
        Thuonghieu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Xuatxu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Kieudang: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Loaimay: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Duongkinh: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Chatlieu: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Sizeday: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Chongnuoc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    soLuong: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    giaTien: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    giamGia: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    anhSP: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        return JSON.parse(this.getDataValue("anhSP") || "[]");
      },
      set(value) {
        this.setDataValue("anhSP", JSON.stringify([].concat(value)));
      },
    },
  },
  {
    tableName: "SanPham",
  }
);

SanPham.associate = (models) => {
  SanPham.belongsTo(models.DanhMuc, {
    foreignKey: "maDM",
    as: "DanhMuc",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  SanPham.hasMany(CT_HoaDonNhap, {
    foreignKey: "maSP",
    as: "CT_HoaDonNhaps",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  SanPham.hasMany(CT_HoaDonBan, {
    foreignKey: "maSP",
    as: "CT_HoaDonBans",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

module.exports = SanPham;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CTHoaDonBan = sequelize.define(
  "CT_HoaDonBan",
  {
    ma_CTHDB: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    maHDB: {
      type: DataTypes.UUID,
      references: {
        model: "HoaDonBan",
        key: "maHDB",
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
    tableName: "CT_HoaDonBan",
  }
);

CTHoaDonBan.associate = (models) => {
  CTHoaDonBan.belongsTo(models.HoaDonBan, {
    foreignKey: "maHDB",
    as: "HoaDonBan",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  CTHoaDonBan.belongsTo(models.SanPham, {
    foreignKey: "maSP",
    as: "SanPham",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

module.exports = CTHoaDonBan;

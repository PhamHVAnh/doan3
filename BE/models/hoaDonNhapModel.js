const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HoaDonNhap = sequelize.define(
  "HoaDonNhap",
  {
    maHDN: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ngayNhap: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    giamGia: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    tongTien: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    phuongThuc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maND: {
      type: DataTypes.UUID,
      references: {
        model: "NguoiDung",
        key: "maND",
      },
      allowNull: false,
    },
    maNCC: {
      type: DataTypes.UUID,
      references: {
        model: "NhaCungCap",
        key: "maNCC",
      },
      allowNull: false,
    },
  },
  {
    tableName: "HoaDonNhap",
  }
);

HoaDonNhap.associate = (models) => {
  HoaDonNhap.belongsTo(models.NguoiDung, {
    foreignKey: "maND",
    as: "NguoiDung",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  HoaDonNhap.belongsTo(models.NhaCungCap, {
    foreignKey: "maNCC",
    as: "NhaCungCap",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  HoaDonNhap.hasMany(models.CTHoaDonNhap, {
    foreignKey: "maHDN",
    as: "CTHoaDonNhaps",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

module.exports = HoaDonNhap;

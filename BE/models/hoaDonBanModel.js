const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HoaDonBan = sequelize.define(
  "HoaDonBan",
  {
    maHDB: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ngayBan: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    trangThai: {
      type: DataTypes.STRING,
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
    ghiChu: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "HoaDonBan",
  }
);

HoaDonBan.associate = (models) => {
  HoaDonBan.belongsTo(models.NguoiDung, {
    foreignKey: "maND",
    as: "NguoiDung",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  HoaDonBan.hasMany(models.CTHoaDonBan, {
    foreignKey: "maHDB",
    as: "CTHoaDonBans",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

module.exports = HoaDonBan;

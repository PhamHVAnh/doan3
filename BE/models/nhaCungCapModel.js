const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const NhaCungCap = sequelize.define(
  "NhaCungCap",
  {
    maNCC: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenNCC: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    diaChi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sdt: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [10, 10],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    tableName: "NhaCungCap",
  }
);

NhaCungCap.associate = (models) => {
  NhaCungCap.hasMany(models.HoaDonNhap, {
    foreignKey: "maNCC",
    as: "HoaDonNhaps",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

module.exports = NhaCungCap;

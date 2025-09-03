const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const VaiTro = sequelize.define(
  "VaiTro",
  {
    maVT: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    tenVT: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "VaiTro",
  }
);

VaiTro.associate = (models) => {
  VaiTro.hasMany(models.NguoiDung, {
    foreignKey: "maVT",
    as: "NguoiDungs",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

module.exports = VaiTro;

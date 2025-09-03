// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/database");

// const DanhMuc = sequelize.define(
//   "DanhMuc",
//   {
//     maDM: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     tenDM: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     tableName: "DanhMuc",
//   }
// );

// DanhMuc.associate = (models) => {
//   // DanhMuc.belongsTo(models.DanhMuc, {
//   //   foreignKey: "maDM",
//   //   as: "DanhMuc",
//   //   onDelete: "CASCADE",
//   //   onUpdate: "CASCADE",
//   // });
//   DanhMuc.hasMany(models.SanPham, {
//     foreignKey: "ma_CTDM",
//     as: "SanPhams",
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   });
// };

// module.exports = DanhMuc;

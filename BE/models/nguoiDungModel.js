const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const md5 = require("md5");

const NguoiDung = sequelize.define(
  "NguoiDung",
  {
    maND: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenND: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    diaChi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ngaySinh: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    sdt: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
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
    taiKhoan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    matKhau: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        if (this.isNewRecord) {
          this.setDataValue("matKhau", md5(value));
        } else {
          this.setDataValue("matKhau", value);
        }
      },
    },
    anhThe: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        return JSON.parse(this.getDataValue("anhThe") || "[]");
      },
      set(value) {
        this.setDataValue("anhThe", JSON.stringify([].concat(value)));
      },
    },
    maVT: {
      type: DataTypes.STRING,
      defaultValue: "U11",
      references: {
        model: "VaiTro",
        key: "maVT",
      },
      allowNull: false,
    },
  },
  {
    tableName: "NguoiDung",
  }
);

NguoiDung.associate = (models) => {
  NguoiDung.belongsTo(models.VaiTro, {
    foreignKey: "maVT",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

module.exports = NguoiDung;

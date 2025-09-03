const { Sequelize } = require("sequelize");

//
const sequelize = new Sequelize("DongHo", "root", "12345678", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamps: true,
  },
});

module.exports = sequelize;

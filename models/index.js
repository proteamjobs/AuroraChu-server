const Sequelize = require("sequelize");
const db = {};
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
require("dotenv").config();

const DATABASE = process.env.DB_DATABASE;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  timezone: "Asia/Seoul",
  define: {
    timestamps: true
  }
});

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = sequelize;

module.exports = db;

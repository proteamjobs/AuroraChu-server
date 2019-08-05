const Sequelize = require("sequelize");
const db = {};
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const configDataBase = require("../config/config.json").database;
require("dotenv").config();

const NODE_ENV = process.env.NODE_ENV;

const DATABASE = configDataBase[NODE_ENV].database;
const USERNAME = configDataBase[NODE_ENV].username;
const PASSWORD = configDataBase[NODE_ENV].password;

const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: configDataBase[NODE_ENV].host,
  dialect: configDataBase[NODE_ENV].dialect,
  port: configDataBase[NODE_ENV].port,
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

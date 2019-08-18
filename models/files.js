const Sequelize = require("sequelize");
const db = require("../models");

module.exports = (sequelize, DataTypes) => {
  const files = sequelize.define(
    "files",
    {
      _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      file_size: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false
      }
    },
    {
      timestamps: true
    }
  );

  files.associate = function(models) {
    files.belongsTo(models.marketer_applies, {
      foreignKey: "apply_id",
      targetKey: "_id"
    });
  };

  return files;
};

// users.hasMany(models.orders, {
//   foreignKey: "buyer_id",
//   sourceKey: "_id"
// });
// users.hasMany(models.travels, {
//   foreignKey: "traveler_id",
//   sourceKey: "_id"
// });

const Sequelize = require("sequelize");
const db = require(".");

module.exports = (sequelize, DataTypes) => {
  const marketer_applies = sequelize.define(
    "marketer_applies",
    {
      _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      status: {
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

  marketer_applies.associate = function(models) {
    marketer_applies.belongsTo(models.users, {
      foreignKey: "user_id",
      targetKey: "_id"
    });

    marketer_applies.hasMany(models.files, {
      foreignKey: "apply_id",
      sourceKey: "_id"
    });
  };

  return marketer_applies;
};

// videos.belongsToMany(models.users, {
//   through: "videos_process",
//   foreignKey: "video_id"
// });
// users.hasMany(models.orders, {
//   foreignKey: "buyer_id",
//   sourceKey: "_id"
// });
// users.hasMany(models.travels, {
//   foreignKey: "traveler_id",
//   sourceKey: "_id"
// });

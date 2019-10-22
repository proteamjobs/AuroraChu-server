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
      foreignKey: { name: "fk_user_id", allowNull: false },
      targetKey: "_id",
      onDelete: "cascade"
    });

    marketer_applies.hasMany(models.files, {
      foreignKey: { name: "fk_apply_id", allowNull: false },
      sourceKey: "_id",
      onDelete: "cascade"
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

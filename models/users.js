const Sequelize = require("sequelize");
const db = require("../models");

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    "users",
    {
      _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
      },
      profile_url: {
        type: DataTypes.STRING,
        defaultValue:
          "https://wake-up-file-server.s3.ap-northeast-2.amazonaws.com/profile_img/defaultProfile.png",
        allowNull: false
      },
      account: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phone_num: {
        type: DataTypes.STRING,
        allowNull: true
      },
      test_score: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      is_current_member: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
        allowNull: false
      },
      is_marketing_agree: {
        type: DataTypes.BOOLEAN,
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

  users.associate = function(models) {
    users.belongsToMany(models.videos, {
      through: "videos_processes",
      foreignKey: "fk_user_id"
    });
    users.hasMany(models.marketer_applies, {
      foreignKey: { name: "fk_user_id", allowNull: false }
    });
    users.hasMany(models.marketer_posts, {
      foreignKey: { name: "fk_user_id", allowNull: false }
    });
  };

  return users;
};

// users.hasMany(models.orders, {
//   foreignKey: "buyer_id",
//   sourceKey: "_id"
// });
// users.hasMany(models.travels, {
//   foreignKey: "traveler_id",
//   sourceKey: "_id"
// });

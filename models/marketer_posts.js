const Sequelize = require("sequelize");
// const db = require(".");

module.exports = (sequelize, DataTypes) => {
  const marketer_posts = sequelize.define(
    "marketer_posts",
    {
      _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      imaga_url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      avg_duration: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      category: {
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

  marketer_posts.associate = function(models) {
    marketer_posts.belongsTo(models.users, {
      foreignKey: { name: "fk_user_id", allowNull: false },
      targetKey: "_id"
    });
    // users.belongsToMany(models.videos, {
    //   through: "videos_processes",
    //   foreignKey: "fk_user_id"
    // });
    // users.hasMany(models.marketer_applies, {
    //   foreignKey: { name: "fk_user_id", allowNull: false }
    // });
  };

  return marketer_posts;
};

// users.hasMany(models.orders, {
//   foreignKey: "buyer_id",
//   sourceKey: "_id"
// });
// users.hasMany(models.travels, {
//   foreignKey: "traveler_id",
//   sourceKey: "_id"
// });

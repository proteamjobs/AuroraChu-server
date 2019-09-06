const Sequelize = require("sequelize");
// const db = require(".");

module.exports = (sequelize, DataTypes) => {
  const reviews = sequelize.define(
    "reviews",
    {
      _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      star: {
        type: DataTypes.INTEGER,
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

  reviews.associate = function(models) {
    reviews.belongsTo(models.users, {
      foreignKey: { name: "fk_user_id", allowNull: false },
      targetKey: "_id"
    });
    reviews.belongsTo(models.marketer_posts, {
      foreignKey: { name: "fk_post_id", allowNull: false },
      targetKey: "_id"
    });
  };

  return reviews;
};

// users.hasMany(models.orders, {
//   foreignKey: "buyer_id",
//   sourceKey: "_id"
// });
// users.hasMany(models.travels, {
//   foreignKey: "traveler_id",
//   sourceKey: "_id"
// });

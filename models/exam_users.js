const Sequelize = require("sequelize");
// const db = require(".");

module.exports = (sequelize, DataTypes) => {
  const exam_users = sequelize.define(
    "exam_users",
    {
      _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      test_score: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      test_result: {
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

  exam_users.associate = function(models) {
    exam_users.belongsTo(models.users, {
      foreignKey: { name: "fk_user_id", allowNull: false },
      targetKey: "_id",
      onDelete: "cascade"
    });
    // marketer_posts.hasMany(models.reviews, {
    //   foreignKey: { name: "fk_post_id", allowNull: false }
    // });
  };

  return exam_users;
};

// users.hasMany(models.orders, {
//   foreignKey: "buyer_id",
//   sourceKey: "_id"
// });
// users.hasMany(models.travels, {
//   foreignKey: "traveler_id",
//   sourceKey: "_id"
// });

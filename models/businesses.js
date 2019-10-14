const Sequelize = require("sequelize");
// const db = require(".");

module.exports = (sequelize, DataTypes) => {
  const businesses = sequelize.define(
    "businesses",
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
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      is_confirm: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      requirement: {
        type: DataTypes.TEXT,
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

  businesses.associate = function(models) {
    businesses.belongsTo(models.users, {
      foreignKey: { name: "fk_buyer_id", allowNull: false },
      targetKey: "_id"
    });
    businesses.belongsTo(models.marketer_posts, {
      foreignKey: { name: "fk_post_id", allowNull: false },
      targetKey: "_id"
    });
  };

  return businesses;
};

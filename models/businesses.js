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
      unit_price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      purchase_count: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      total_price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      final_amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      use_credit: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      trade: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      is_confirm: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      requirement: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
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

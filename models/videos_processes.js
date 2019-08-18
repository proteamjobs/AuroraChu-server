const Sequelize = require("sequelize");
const db = require(".");

module.exports = (sequelize, DataTypes) => {
  const videos_processes = sequelize.define("videos_processes", {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    }
  });

  // files.associate = function(models) {
  //   files.belongsTo(models.marketer_applies, {
  //     foreignKey: "apply_id",
  //     targetKey: "_id"
  //   });
  // };

  return videos_processes;
};

const db = require("../models");

module.exports = async nickname => {
  let countNickName = await db.users.findAndCountAll({
    where: {
      nickname: nickname
    }
  });

  return countNickName.count;
};

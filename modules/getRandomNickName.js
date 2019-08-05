const db = require("../models");
const getNickNameCount = require("./getNickNameCount");

module.exports = async nickname => {
  let recursionFunction = async nickname => {
    if ((await getNickNameCount(nickname)) === 0) {
      return nickname;
    } else {
      return await recursionFunction(nickname + Math.floor(Math.random() * 10));
    }
  };
  return await recursionFunction(nickname);
};

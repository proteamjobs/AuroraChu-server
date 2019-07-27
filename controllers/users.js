module.exports = {
  test: {
    get: (req, res) => {
      console.log("/users/test Hello!");
      res.status(200).send("/users/test HELLO!!");
    }
  }
};

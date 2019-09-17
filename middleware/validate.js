const db = require("../data/db-config.js");

const validateNewUser = (req, res, next) => {
  const { body } = req;

  if (body.username && body.password) {
    next();
  } else {
    res
      .status(400)
      .json({ message: "New user must have a valid username and password" });
  }
};

module.exports = {
  validateNewUser
};

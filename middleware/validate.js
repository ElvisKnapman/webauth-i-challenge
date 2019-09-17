const db = require("../data/db-config.js");
const Users = require("../helpers/helpers.js");
const validateBody = (req, res, next) => {
  const { body } = req;

  if (body.username && body.password) {
    next();
  } else {
    res
      .status(400)
      .json({ message: "user must have a valid username and password" });
  }
};

const checkIfUsernameTaken = async (req, res, next) => {
  const { username } = req.body;
  try {
    const result = await db("users")
      .where({ username })
      .first();
    if (result) {
      res.status(400).json({ message: "Username already taken" });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error validating username" });
  }
};

module.exports = {
  validateBody,
  checkIfUsernameTaken
};

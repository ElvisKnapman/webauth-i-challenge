const db = require("../data/db-config.js");

const findById = id => {
  return db("users")
    .where({ id })
    .first();
};

const createUser = newUser => {
  return db("users")
    .insert(newUser)
    .then(([id]) => {
      return findById(id);
    });
};

const login = filter => {
  return db("users")
    .where(filter)
    .first();
};

const getUsers = () => {
  return db("users");
};

module.exports = {
  findById,
  createUser,
  login,
  getUsers
};

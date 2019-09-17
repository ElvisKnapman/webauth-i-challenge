const express = require("express");
const bcrypt = require("bcryptjs");

const server = express();

// helpers
const Users = require("../helpers/helpers.js");

// middleware
const {
  validateBody,
  checkIfUsernameTaken
} = require("../middleware/validate.js");

server.use(express.json());

server.get("/api", (req, res) => {
  res.status(200).json({ message: "API up..." });
});

server.post(
  "/api/register",
  validateBody,
  checkIfUsernameTaken,
  async (req, res) => {
    const { body } = req;
    const hash = bcrypt.hashSync(body.password, 15);
    body.password = hash;
    try {
      const result = await Users.createUser(body);
      if (result) {
        res.status(201).json(result);
      } else {
        res.status(400).json({ message: "User could not be created" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server could not create user" });
    }
  }
);

server.post("/api/login", validateBody, async (req, res) => {
  const { body } = req;
  try {
    const user = await Users.login({ username: body.username });
    console.log("USER", user);
    if (user) {
      const auth = bcrypt.compareSync(body.password, user.password);
      console.log("AUTH", auth);
      if (auth) {
        res.status(200).json({ message: `Welcome, ${user.username}` });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server encountered error logging in" });
  }
});

server.get("/api/users", async (req, res) => {
  const result = await Users.getUsers();
  res.status(200).json(result);
});

module.exports = server;

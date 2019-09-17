const express = require("express");

const server = express();

// helpers
const Users = require("../helpers/helpers.js");

// middleware
const { validateNewUser } = require("../middleware/validate.js");

server.use(express.json());

server.get("/api", (req, res) => {
  res.status(200).json({ message: "API up..." });
});

server.post("/api/register", validateNewUser, async (req, res) => {
  const { body } = req;
  try {
    const result = await Users.createUser(body);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(400).json({ message: "User could not be created" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server could not create user" });
  }
});

server.post("/api/login", (req, res) => {});

server.get("/api/users", async (req, res) => {
  const result = await Users.getUsers();
  res.status(200).json(result);
});

module.exports = server;

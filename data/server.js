const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const dbConnection = require("../data/db-config.js");

const server = express();

const sessionConfig = {
  name: "bardown",
  secret: process.env.SESSION_SECRET || "keep it secret, keep it safe",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUnitialized: true,
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: "knexsessions",
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

// helpers
const Users = require("../helpers/helpers.js");

// middleware
const {
  validateBody,
  checkIfUsernameTaken,
  validateUser
} = require("../middleware/validate.js");

server.use(express.json());
server.use(session(sessionConfig));

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
  const { username, password } = req.body;
  try {
    const user = await Users.login({ username });
    console.log("USER", user);
    if (user) {
      const auth = bcrypt.compareSync(password, user.password);
      console.log("AUTH", auth);
      if (auth) {
        req.session.user = user;
        res.status(200).json({ message: `Welcome, ${user.username}` });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server encountered error logging in" });
  }
});

server.get("/api/users", validateUser, async (req, res) => {
  const result = await Users.getUsers();
  res.status(200).json(result);
});

module.exports = server;

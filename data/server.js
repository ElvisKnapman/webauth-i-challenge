const express = require("express");

const server = express();

server.use(express.json());

server.get("/api", (req, res) => {
  res.status(200).json({ message: "API up..." });
});

server.post("/api/register", (req, res) => {});

server.post("/api/login", (req, res) => {});

server.get("/api/users", (req, res) => {});

module.exports = server;

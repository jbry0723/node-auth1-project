const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const cors = require("cors");
const KnexSessionStore = require("connect-session-knex")(session);

const usersRouter = require("./users/users-router");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(
  session({
    name: "thing",
    secret: "it is a secret",
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
      knex: require("../data/dbconfig"),
      tablename: "sessions",
      sidfieldname: "sid",
      createtable: true,
      clearInterval: 1000 * 60 * 60,
    }),
  })
);

server.use("/api", usersRouter);

module.exports = server;

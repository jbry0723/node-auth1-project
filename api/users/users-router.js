const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const protected = require("../middleware/auth-middleware");

const { validateCredentials } = require("../middleware/middleware");

const User = require("./users-model.js");

router.post("/register", validateCredentials, (req, res, next) => {
  const { username, password } = req.body;
  const hashed = bcrypt.hashSync(password, 10);

  User.add({ username, password: hashed, role: 2 })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch(next);
});

router.post("/login", validateCredentials, async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const allegedUser = await User.findBy({ username: username }).first();
    if (allegedUser && bcrypt.compareSync(password, allegedUser.password)) {
      req.session.user = allegedUser;
      res.json("You are now logged in");
    } else {
      res.status(401).json("You shall not pass!");
    }
  } catch (err) {
    next(err);
  }
});

router.get("/logout", (req, res, next) => {
  if (req.session && req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        res.json("you cannot leave");
      } else {
        res.json("You have left");
      }
    });
  } else {
    res.json("You are not logged in");
  }
});

router.get("/users", protected, (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.send(err));
});

router.use((error, req, res, next) => {
  res.status(500).json({
    info: "There was an error in the router",
    message: error.message,
    stack: error.stack,
  });
});

module.exports = router;

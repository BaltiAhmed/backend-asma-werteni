const express = require("express");
const route = express.Router();

const AdminControllers = require("../controllers/Admin");

const { check } = require("express-validator");

route.post(
  "/signup",
  check("email").normalizeEmail(),

  check("password").isLength({ min: 8 }),
  AdminControllers.signup
);

route.post(
  "/login",
  check("email").normalizeEmail(),
  check("password").isLength({ min: 8 }),
  AdminControllers.login
);

module.exports = route;

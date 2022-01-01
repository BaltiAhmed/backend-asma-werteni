const express = require("express");
const route = express.Router();

const contactControllers = require("../controllers/contact");

const { check } = require("express-validator");


route.get(
  "/ajoutcontact",
//   check("nom").not().isEmpty(),
//   check("email").not().isEmpty(),
//   check("message").not().isEmpty(),
  contactControllers.ajoutcontact
);


module.exports = route;

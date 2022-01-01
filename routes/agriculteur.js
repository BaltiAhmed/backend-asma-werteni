const express = require("express");
const route = express.Router();

const agriculteurControllers = require("../controllers/agriculteur");

const { check } = require("express-validator");

route.post(
  "/updateProfile",
  
  agriculteurControllers.updateProfile
);

route.post(
  "/signup",
  check("nom").not().isEmpty(),
  check("prenom").not().isEmpty(),
  check("datenaissa"),
  check("telephone").isLength({ min: 8 }),
  check("adresse").not().isEmpty(),
  check("email"),
  // check("password").isLength({ min: 8 }),
  agriculteurControllers.signup
);

route.post(
  "/login",
  check("email"),
  check("password"),
  agriculteurControllers.login
);

// route.get("/:id", agriculteurControllers.getAgriculteurById);
route.get("/", agriculteurControllers.getAllAgriculteur);

route.delete("/:id", agriculteurControllers.deleteAgriculteur);



module.exports = route;

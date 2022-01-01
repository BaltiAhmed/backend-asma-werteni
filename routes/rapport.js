const express = require("express");
const route = express.Router();

const rapportControllers = require("../controllers/rapport");

const { check } = require("express-validator");

route.post(
  "/ajoutrapport",
  check("date").not().isEmpty(),
  check("sujet").not().isEmpty(),
  check("repondre").not().isEmpty(),
  rapportControllers.ajoutrapport
);




route.delete('/:id',rapportControllers.deleterapport)
route.get('/:id', rapportControllers.getrapportById)
route.get('/:', rapportControllers.getrapport)

module.exports = route;
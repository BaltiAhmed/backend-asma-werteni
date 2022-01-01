const express = require("express");
const route = express.Router();

const reclamationControllers = require("../controllers/reclamation");

const { check } = require("express-validator");

route.post(
  "/ajoutreclamation",
  check("sujet").not().isEmpty(),
  reclamationControllers.ajoutreclamation
);
route.post(
  "/updateclamation",
  check("reponse").not().isEmpty(),
  reclamationControllers.updateclamation
);

route.post(
  "/getreclamationById",
  check("id").not().isEmpty(),
  reclamationControllers.getreclamationById
);


route.delete('/:id',reclamationControllers.deletereclamation)
// route.get('/:id', reclamationControllers.getreclamationById)
route.get('/', reclamationControllers.getreclamation)

module.exports = route;

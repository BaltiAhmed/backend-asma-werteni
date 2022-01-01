const express = require("express");
const route = express.Router();

const reponceControllers = require("../controllers/reponce");

const { check } = require("express-validator");

route.post(
  "/ajout",

  check("description").not().isEmpty(),

  check("cause").not().isEmpty(),
  check("nom").not().isEmpty(),

  reponceControllers.ajoutreponce
);

route.get('/',reponceControllers.getReponce)
route.get('/demande/:id',reponceControllers.getReponceByDemandeId)

module.exports = route;

const express = require("express");
const route = express.Router();

const demandeControllers = require("../controllers/demande-diagnostique");
const fileUpload = require("../middleware/file-uploades");

const { check } = require("express-validator");

route.post("/ajout",fileUpload.single("image"), demandeControllers.ajout);
route.post("/getDemandeById",check("id"),demandeControllers.getDemandeById);
route.post("/updateDemande", demandeControllers.updateDemande);
route.get('/',demandeControllers.getDemande)

route.get('/agriculteur/:id',demandeControllers.getDemandeByAgriculteurId)

module.exports = route;

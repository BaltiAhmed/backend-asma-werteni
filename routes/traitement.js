const express = require("express");
const route = express.Router();

const traitementControllers = require("../controllers/traitement");

const { check } = require("express-validator");

const fileUpload = require("../middleware/file-uploades");

route.post(
  "/ajouttraitement",
  fileUpload.single("image"),
  [check("description").not().isEmpty(), check("prix").not().isEmpty()],
  traitementControllers.ajouttraitement
);

route.patch(
  "/:id",
  fileUpload.single("image"),
  [check("description").not().isEmpty(), check("prix").not().isEmpty()],
  traitementControllers.updatetraitement
);

route.delete("/:id", traitementControllers.deletetraitement);
route.get("/:id", traitementControllers.gettraitementById);
route.get("/", traitementControllers.gettraitement);
route.get("/maladie/:id", traitementControllers.gettraitementByMaladieId);
route.get("/reponce/:id", traitementControllers.getTraitementByReponceId);

module.exports = route;

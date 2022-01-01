const httpError = require("../models/error");

const reponce = require("../models/reponce");
const traitement = require("../models/traitement");
const demandeDiagnostique = require("../models/demande-diagnostique");

const { validationResult } = require("express-validator");
const { response } = require("express");

const ajoutreponce = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, description, cause, traitementId1, traitementId2, demandeId } =
    req.body;

  let existingtraitement;
  try {
    existingtraitement = await traitement.findById(traitementId1);
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }

  let existingtraitement1;
  try {
    existingtraitement1 = await traitement.findById(traitementId2);
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }

  let existingDemande;
  try {
    existingDemande = await demandeDiagnostique.findById(demandeId);
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }

  const createdreponce = new reponce({
    nom,
    description,
    cause,
    description1: existingtraitement1.description,
    image1: existingtraitement1.image,
    prix1: existingtraitement1.prix,
    description2: existingtraitement.description,
    image2: existingtraitement.image,
    prix2: existingtraitement.prix,
  });

  try {
    existingDemande.reponses.push(createdreponce);
    existingDemande.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ reponce: createdreponce });
};

const getReponce = async (req, res, next) => {
  let existingReponce;
  try {
    existingReponce = await reponce.find();
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }
  res.json({ reponce: existingReponce });
};

const getReponceByDemandeId = async (req, res, next) => {
  const id = req.params.id;

  let existingReponce;
  try {
    existingReponce = await demandeDiagnostique
      .findById(id)
      .populate("reponses");
  } catch (err) {
    const error = new httpError(
      "Fetching BolPlan failed, please try again later.",
      500
    );
    return next(error);
  }

  console.log(existingReponce)

  if (!existingReponce || existingReponce.reponses.length === 0) {
    return next(
      new httpError("Could not find responce for the provided user id.", 404)
    );
  }

  res.json({
    reponce: existingReponce.reponses.map((el) =>
      el.toObject({ getters: true })
    ),
    id: existingReponce._id,
  });
};

exports.ajoutreponce = ajoutreponce;
exports.getReponce = getReponce;
exports.getReponceByDemandeId = getReponceByDemandeId;

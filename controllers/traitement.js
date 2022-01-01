const httpError = require("../models/error");

const traitement = require("../models/traitement");
const maladie = require("../models/maladie");
const reponce = require("../models/reponce");

const { validationResult } = require("express-validator");

const ajouttraitement = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { description, prix, maladieId } = req.body;

  const createdtraitement = new traitement({
    description,
    image: req.file.path,
    prix,
  });

  let existingmaladie;
  try {
    existingmaladie = await maladie.findById(maladieId);
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }

  try {
    createdtraitement.save();
    existingmaladie.traitements.push(createdtraitement);
    existingmaladie.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ traitement: createdtraitement });
};

const updatetraitement = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { description, prix } = req.body;
  const id = req.params.id;
  let existingtraitement;
  try {
    existingtraitement = await traitement.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingtraitement.description = description;
  existingtraitement.image = req.file.path;
  existingtraitement.prix = prix;

  try {
    existingtraitement.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ traitement: existingtraitement });
};

const gettraitement = async (req, res, next) => {
  let existingtraitement;
  try {
    existingtraitement = await traitement.find({}, "-password");
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }
  res.json({ traitement: existingtraitement });
};

const gettraitementById = async (req, res, next) => {
  const id = req.params.id;
  let existingtraitement;
  try {
    existingtraitement = await traitement.findById(id);
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }
  res.json({ traitement: existingtraitement });
};

const deletetraitement = async (req, res, next) => {
  const id = req.params.id;
  let existingtraitement;

  try {
    existingtraitement = await traitement.findById(id);
  } catch {
    return next(new httpError("failed to fetch !!", 500));
  }
  if (!existingtraitement) {
    return next(new httpError("user does not exist !!", 500));
  }
  try {
    existingtraitement.remove();
  } catch {
    return next(new httpError("failed !!!", 500));
  }
  res.status(200).json({ message: "deleted" });
};

const gettraitementByMaladieId = async (req, res, next) => {
  const id = req.params.id;

  let traitement;
  try {
    traitement = await maladie.findById(id).populate("traitements");
  } catch (err) {
    const error = new httpError(
      "Fetching places failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!traitement || traitement.traitements.length === 0) {
    return next(
      new httpError(
        "Could not find traitement for the provided maladie id.",
        404
      )
    );
  }

  res.json({
    traitement: traitement.traitements.map((item) =>
      item.toObject({ getters: true })
    ),
  });
};

const getTraitementByReponceId = async (req, res, next) => {
  const id = req.params.id;

  console.log(id)

  let traitement;
  try {
    traitement = await reponce.findById(id).populate("traitement");
  } catch (err) {
    const error = new httpError(
      "Fetching places failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!traitement || traitement.traitement.length === 0) {
    return next(
      new httpError(
        "Could not find traitement for the provided reponce id.",
        404
      )
    );
  }

  res.json({
    traitement: traitement.traitement.map((item) =>
      item.toObject({ getters: true })
    ),
  });
};

exports.ajouttraitement = ajouttraitement;
exports.updatetraitement = updatetraitement;
exports.gettraitement = gettraitement;
exports.gettraitementById = gettraitementById;
exports.deletetraitement = deletetraitement;
exports.gettraitementByMaladieId = gettraitementByMaladieId
exports.getTraitementByReponceId = getTraitementByReponceId
const httpError = require("../models/error");

const maladie = require("../models/maladie");
const plante = require("../models/plante");

const { validationResult } = require("express-validator");

const ajoutmaladie = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, description, cause, prevension, planteId } = req.body;

  const createdMaladie = new maladie({
    nom,
    description,
    cause,
    prevension,
    traitements: [],
  });

  let existingPlante;
  try {
    existingPlante = await plante.findById(planteId);
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }

  try {
    createdMaladie.save();
    existingPlante.maladies.push(createdMaladie);
    existingPlante.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ maladie: createdMaladie });
};

const updateMaladie = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, description, cause, prevension } = req.body;
  const id = req.params.id;
  let existingmaladie;
  try {
    existingmaladie = await maladie.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingmaladie.nom = nom;
  existingmaladie.description = description;
  existingmaladie.cause = cause;
  existingmaladie.prevension = prevension;

  try {
    existingmaladie.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ maladie: existingmaladie });
};

const getMaladie = async (req, res, next) => {
  let existingmaladie;
  try {
    existingmaladie = await maladie.find({}, "-password");
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }
  res.json({ maladie: existingmaladie });
};

const getMaladieById = async (req, res, next) => {
  const id = req.params.id;
  let existingmaladie;
  try {
    existingmaladie = await maladie.findById(id);
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }
  res.json({ maladie: existingmaladie });
};

const getMaladieByPlanteId = async (req, res, next) => {
  const id = req.params.id;

  let maladie;
  try {
    maladie = await plante.findById(id).populate("maladies");
  } catch (err) {
    const error = new httpError(
      "Fetching places failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!maladie || maladie.maladies.length === 0) {
    return next(
      new httpError("Could not find maladie for the provided plante id.", 404)
    );
  }

  res.json({
    maladies: maladie.maladies.map((item) => item.toObject({ getters: true })),
  });
};

const deleteMaladie = async (req, res, next) => {
  const id = req.params.id;
  let existingMaladie;

  try {
    existingMaladie = await maladie.findById(id);
  } catch {
    return next(new httpError("failed to fetch !!", 500));
  }
  if (!existingMaladie) {
    return next(new httpError("user does not exist !!", 500));
  }
  try {
    existingMaladie.remove();
  } catch {
    return next(new httpError("failed !!!", 500));
  }
  res.status(200).json({ message: "deleted" });
};

exports.ajoutmaladie = ajoutmaladie;
exports.updateMaladie = updateMaladie;
exports.getMaladie = getMaladie;
exports.getMaladieById = getMaladieById;
exports.getMaladieByPlanteId = getMaladieByPlanteId;
exports.deleteMaladie = deleteMaladie;

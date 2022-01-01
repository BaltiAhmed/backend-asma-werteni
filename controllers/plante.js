const httpError = require("../models/error");

const plante = require("../models/plante");

const { validationResult } = require("express-validator");

const ajoutplante = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, type, description } = req.body;

  const createdPlante = new plante({
    nom,
    type,
    description,
    image:req.file.path,
    maladies: [],
  });

  try {
    await createdPlante.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ plante: createdPlante });
};

const getPlante = async (req, res, next) => {
  let existingPlante;
  try {
    existingPlante = await plante.find({}, "-password");
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }
  res.json({ plante: existingPlante });
};

const getPlanteById = async (req, res, next) => {
  const id = req.params.id;
  let existingPlante;
  try {
    existingPlante = await plante.findById(id);
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }
  res.json({ plante: existingPlante });
};

const deleteplante = async (req, res, next) => {
  const id = req.params.id;
  let existingPlante;

  try {
    existingPlante = await plante.findById(id);
  } catch {
    return next(new httpError("failed to fetch !!", 500));
  }
  if (!existingPlante) {
    return next(new httpError("user does not exist !!", 500));
  }
  try {
    existingPlante.remove();
  } catch {
    return next(new httpError("failed !!!", 500));
  }
  res.status(200).json({ message: "deleted" });
};

const updateplante = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, type,description } = req.body;
  const id = req.params.id;
  let existingPlante;
  try {
    existingPlante = await plante.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingPlante.nom = nom;
  existingPlante.type = type;
  existingPlante.description =description;
  existingPlante.image = req.file.path;


  try {
    existingPlante.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ plante: existingPlante });
};

exports.ajoutplante = ajoutplante;
exports.getPlante = getPlante;
exports.getPlanteById = getPlanteById;
exports.updateplante=  updateplante;
exports.deleteplante = deleteplante;
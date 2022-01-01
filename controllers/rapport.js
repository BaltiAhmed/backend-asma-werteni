const httpError = require("../models/error");

const rapport = require("../models/rapport");

const { validationResult } = require("express-validator");

const ajoutrapport = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { date,lieu, lecture } = req.body;

  const createdrapport = new rapport({
    date,
    lieu,
    lecture,
  });

  try {
    await createdrapport.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ rapport: createdrapport });
};

const getrapport = async (req, res, next) => {
  let existingrapport;
  try {
    existingrapport = await rapport.find({}, "-password");
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }
  res.json({ rapport: existingrapport });
};

const getrapportById = async (req, res, next) => {
  const id = req.params.id;
  let existingrapport;
  try {
    existingrapport = await rapport.findById(id);
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }
  res.json({ rapport: existingrapport });
};

const deleterapport = async (req, res, next) => {
  const id = req.params.id;
  let existingrapport;

  try {
    existingrapport = await rapport.findById(id);
  } catch {
    return next(new httpError("failed to fetch !!", 500));
  }
  if (!existingrapport) {
    return next(new httpError("user does not exist !!", 500));
  }
  try {
    existingrapport.remove();
  } catch {
    return next(new httpError("failed !!!", 500));
  }
  res.status(200).json({ message: "deleted" });
};

exports.ajoutrapport = ajoutrapport;
exports.getrapport = getrapport;
exports.getrapportById = getrapportById;
exports.deleterapport = deleterapport;

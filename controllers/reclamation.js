const httpError = require("../models/error");

const reclamation = require("../models/reclamation");
const agriculteur = require('../models/agriculteur')

const { validationResult } = require("express-validator");

const ajoutreclamation = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { sujet,IdAgriculteur } = req.body;

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth()+ 1;


  const createdreclamation = new reclamation({
    date:date.getFullYear()+"/"+month+"/"+ day,
    sujet,
    reponse:'empty',
    iduser: IdAgriculteur,
  });

  let existingAgriculteur;

  try {
    existingAgriculteur = await agriculteur.findById(IdAgriculteur)
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }

  try {
    await createdreclamation.save();
    existingAgriculteur.reclamations.push(createdreclamation);
    await existingAgriculteur.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ reclamation: createdreclamation });
};

const getreclamation = async (req, res, next) => {
  let existingreclamation;
  try {
    existingreclamation = await reclamation.find({}, "-password");
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }
  res.json({ reclamation: existingreclamation });
};

const getreclamationById = async (req, res, next) => {

  const {id} = req.body;

  let existingUser; 

  try {
    existingUser = await agriculteur.findOne({ _id: id });
    // res.send(existingUser.demandeDiagnostique);
    console.log("users ::::::::::");
    console.log(existingUser);
  } catch {
    return next(new httpError("Something Went Wrong", 422));
  }


  let existingreclamation;
  try {
    existingreclamation = await reclamation.find({ _id : existingUser.reclamations });
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }
  res.json({ reclamation: existingreclamation });
};


const deletereclamation = async (req, res, next) => {
  const id = req.params.id;
  let existingreclamation;

  try {
    existingreclamation = await reclamation.findById(id);
  } catch {
    return next(new httpError("failed to fetch !!", 500));
  }
  if (!existingreclamation) {
    return next(new httpError("user does not exist !!", 500));
  }
  try {
    existingreclamation.remove();
  } catch {
    return next(new httpError("failed !!!", 500));
  }
  res.status(200).json({ message: "deleted" });
};

const updateclamation = async (req, res, next) => {

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { reponse, Idreclam } = req.body;

  let existingReclamation;
  try {
    existingReclamation = await reclamation.findById(Idreclam)
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }

  
  existingReclamation.reponse = reponse;
  try {
    await existingReclamation.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ reclamation: existingReclamation });

};

exports.ajoutreclamation=ajoutreclamation;
exports.getreclamation = getreclamation;
exports.getreclamationById = getreclamationById;
exports.deletereclamation = deletereclamation;
exports.updateclamation = updateclamation;

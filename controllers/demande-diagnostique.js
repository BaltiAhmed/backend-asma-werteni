const httpError = require("../models/error");

const demande = require("../models/demande-diagnostique");
const agriculteur = require("../models/agriculteur");

const { validationResult } = require("express-validator");

const ajout = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { type, couleur, feuille, maladie, blee, sympthome, agriculteurID } =
    req.body;

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth()+ 1;
  // const img = require(`../../assets/+${req.file.filename}`);
  // console.log(img);

  const createdDemande = new demande({
    type,
    date:date.getFullYear()+"/"+month+"/"+ day,
    // image: img,
    image: req.file.path,
    couleur,
    feuille,
    maladie,
    blee,
    sympthome,
    finished: false,
    reponses:[],
  });

  let existingAgriculteur;
  try {
    existingAgriculteur = await agriculteur.findById(agriculteurID);
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }

  try {
    createdDemande.save();
    existingAgriculteur.demandeDiagnostique.push(createdDemande);
    existingAgriculteur.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ demande: createdDemande });
};

const getDemande = async (req, res, next) => {
  let existingDemande;
  try {
    existingDemande = await demande.find();
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }
  res.json({ demande: existingDemande });
};

const getDemandeById = async (req, res, next) => {
  // const id = req.params.id;
  const { id } = req.body;
  let existingUser; 

  try {
    existingUser = await agriculteur.findOne({ _id: id });
    // res.send(existingUser.demandeDiagnostique);
    console.log("users ::::::::::");
    console.log(existingUser);
  } catch {
    return next(new httpError("Something Went Wrong", 422));
  }
  
  let existingDemande;
  try {
    existingDemande = await demande.find({_id : existingUser.demandeDiagnostique });
    console.log("Demandes  ::::::::::");
    console.log(existingDemande);
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }
  // res.send(existingDemande);
  res.json({ demande: existingDemande });
};

const getDemandeByAgriculteurId = async (req, res, next) => {
  const id = req.params.id;

  let existingDemande;
  try {
    existingDemande = await agriculteur.findById(id).populate("demandeDiagnostique");
  } catch (err) {
    const error = new httpError(
      "Fetching BolPlan failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingDemande || existingDemande.demandeDiagnostique.length === 0) {
    return next(
      new httpError("Could not find BonPlan for the provided user id.", 404)
    );
  }

  res.json({
    demandeDiagnostique: existingDemande.demandeDiagnostique.map((el) =>
      el.toObject({ getters: true })
    ),
  });
};

const updateDemande = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { id_demande, nom_maladie, detail_maladie, cause, med1, prix1, med2, prix2, med3, prix3 } = req.body;

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth()+ 1;

  let existingDemande;
  try {
    existingDemande = await demande.findById(id_demande);
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }

  if (!existingDemande.date){
    existingDemande.date = date.getFullYear()+"/"+month+"/"+ day;
  }
  existingDemande.nom_maladie = nom_maladie;
  existingDemande.detail_maladie = detail_maladie;
  existingDemande.cause = cause;
  existingDemande.med1 = med1;
  existingDemande.prix1 = prix1;
  existingDemande.med2 = med2;
  existingDemande.prix2 = prix2;
  existingDemande.med3 = med3;
  existingDemande.prix3 = prix3;
  existingDemande.finished = true;
  
  try {
    existingDemande.save();
  } catch (err) {
    const error = new httpError("failed to udate", 500);
    return next(error);
  }

  res.status(201).json({ demande: existingDemande });
}

exports.ajout = ajout;
exports.getDemande = getDemande;
exports.getDemandeById = getDemandeById;
exports.getDemandeByAgriculteurId = getDemandeByAgriculteurId;
exports.updateDemande = updateDemande;

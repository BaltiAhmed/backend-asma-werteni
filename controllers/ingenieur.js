const httpError = require("../models/error");

const ingenieur = require("../models/ingenieur");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const generator = require("generate-password");

const nodemailer = require("nodemailer");

const log = console.log;
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL || "asmaouertani1234@gmail.com", // TODO: your gmail account
    pass: process.env.PASSWORD || "07983246", // TODO: your gmail password
  },
});

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, prenom, email, telephone } = req.body;
  const password = generator.generate({
    length: 10,
    numbers: true,
  });
  let existinguser;
  try {
    existinguser = await ingenieur.findOne({ email: email });
  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  if (existinguser) {
    const error = new httpError("user exist", 422);
    return next(error);
  }

  const createduser = new ingenieur({
    nom,
    prenom,
    email,
    password,
    telephone,
  });

  try {
    await createduser.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  let mailOptions = {
    from: "asmaouertani1234@gmail.com", // TODO: email sender
    to: email, // TODO: email receiver
    subject: "Confirmation de creation de compte",
    text: "Votre mot de passe est " + password,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log("Error occurs");
    }
    return log("Email sent!!!");
  });

  let token;
  try {
    token = jwt.sign(
      { userId: createduser.id, email: createduser.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }

  res.status(201).json({
    ingenieur: createduser.id,
    email: createduser.email,
    token: token,
  });
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("ivalid input passed", 422));
  }

  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await ingenieur.findOne({ email: email });
  } catch {
    return next(new httpError("failed to find", 422));
  }
  console.log(existingUser)
  if (!existingUser || existingUser.password !== password) {
    return next(new httpError("invalid input passed ", 422));
  }
  let token;
  try {
    token = jwt.sign(
      { ingenieurId: existingUser.id, email: existingUser.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.status(200).json({ ingenieur: existingUser, token: token });
};

const getIngenieurById = async (req, res, next) => {
  const id = req.params.id;
  let existingUser;
  try {
    existingUser = await ingenieur.findById(id);
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ ingenieur: existingUser });
};

const getAllIngenieur = async (req, res, next) => {
  let existingUser;
  try {
    existingUser = await ingenieur.find();
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }
  res.json({ ingenieur: existingUser });
};

const deleteIngenieur = async (req, res, next) => {
  const id = req.params.id;
  let existingUser;

  try {
    existingUser = await ingenieur.findById(id);
  } catch {
    return next(new httpError("failed to fetch !!", 500));
  }
  if (!existingUser) {
    return next(new httpError("user does not exist !!", 500));
  }
  try {
    existingUser.remove();
  } catch {
    return next(new httpError("failed !!!", 500));
  }
  res.status(200).json({ message: "deleted" });
};

const updateIngenieur = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, prenom, email, telephone } = req.body;
  const password = generator.generate({
    length: 10,
    numbers: true,
  });
  const UserId = req.params.id;
  let existingUser;
  try {
    existingUser = await ingenieur.findById(UserId);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingUser.nom = nom;
  existingUser.prenom = prenom;
  existingUser.email = email;
  existingUser.password = password;
  existingUser.telephone = telephone;

  try {
    existingUser.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  let mailOptions = {
    from: "asmaouertani1234@gmail.com", // TODO: email sender
    to: email, // TODO: email receiver
    subject: "Modification de coordonnées",
    text: "Votre mot de passe est " + password,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log("Error occurs");
    }
    return log("Email sent!!!");
  });


  res.status(200).json({ ingenieur: existingUser });
};

exports.signup = signup;
exports.login = login;
exports.getIngenieurById = getIngenieurById;
exports.getAllIngenieur = getAllIngenieur;
exports.deleteIngenieur = deleteIngenieur;
exports.updateIngenieur = updateIngenieur;

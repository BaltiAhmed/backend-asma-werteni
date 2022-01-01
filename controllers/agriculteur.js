const httpError = require("../models/error");

const agriculteur = require("../models/agriculteur");
const ingenieur = require("../models/ingenieur");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const nodemailer = require('nodemailer');

const bcrypt = require('bcryptjs');

const signup = async (req, res, next) => {

  // 
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'GreensPFE@gmail.com',
      pass: 'greens2022'
    }
  });

  const error = validationResult(req);
  
  if (!error.isEmpty()) {
    
    console.log(error);
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, prenom, email, date, telephone, adresse, role } =
    req.body;
    // console.log(req.body);

    const payload = { user: email };
    const token = jwt.sign(payload, 'secret');
    const token1 = token.split('.');
    fianl_token = token1[2].substring(0, 10);
  const datenaissa = date;
  let password = await bcrypt.hash(fianl_token, 8);

  let existinguser;

  try {

    existinguser = await agriculteur.findOne({ email: email });

  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  if (!existinguser) {
    try {

      existinguser = await ingenieur.findOne({ email: email });
  
    } catch (err) {
      const error = new httpError("problems!!!", 500);
      return next(error);
    }
  }


  if (existinguser) {
    const error = new httpError("user exist", 422);
    return next(error);
  }

  if (role == "agriculteur"){
 
    const createduser = new agriculteur({
      nom,
      prenom,
      datenaissa,
      email,
      password,
      telephone,
      adresse,
      reclamations: [],
    });
    try {
      await createduser.save();
    } catch (err) {
      const error = new httpError("failed signup", 500);
      return next(error);
    }
    const datt = new Date();
    const day = datt.getDate();
    const month = datt.getMonth()+ 1;
    var today = datt.getFullYear()+"/"+month+"/"+ day;
    var mailOptions = {
      from: 'GreensPFE@gmail.com',
      to: createduser.email,
      subject: ' مرحبا بك  ',
      text: 'شكرا لاستخدام تطبيقنا  \n'+ today + '\n كلمة السر هي: \n \"'+ fianl_token + '\" \n مرحبا في عالمنا.'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    }); 

    res
    .status(201)
    .json({
      agriculteur: createduser.id,
      email: createduser.email,
      token: "agriculteur",
    });

  } else {

    const createduser = new ingenieur({
      nom,
      prenom,
      datenaissa,
      email,
      password,
      telephone,
      adresse,
    });
    try {
      await createduser.save();
    } catch (err) {
      const error = new httpError("failed signup", 500);
      return next(error);
    }
    const datt = new Date();
    const day = datt.getDate();
    const month = datt.getMonth()+ 1;
    var today = datt.getFullYear()+"/"+month+"/"+ day;
    var mailOptions = {
      from: 'GreensPFE@gmail.com',
      to: createduser.email,
      subject: 'Greens Welcomes you ',
      text: 'Thank u for using our App  \n'+ today + '\n your password is: \n \"'+ fianl_token + '\" \n Welcome to our world.'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    }); 

    res
    .status(201)
    .json({
      agriculteur: createduser.id,
      email: createduser.email,
      token: "ingenieur",
    });
  }

  
  

    
    
  

  
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("ivalid input passed", 422));
  }

  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await agriculteur.findOne({ email: email });

  } catch {
    return next(new httpError("Verify your Email", 422));
  }

let token;
  if (!existingUser){
    try {
      existingUser = await ingenieur.findOne({ email: email });
      token= "ingenieur";
    } catch {
      return next(new httpError("Verify your Email", 422));
    }
  } else {
    token= "agriculteur";
  }


  if (existingUser){
    let x = await bcrypt.compare(password, existingUser.password);
    if (!x) {
      return next(new httpError("Password is Wrong ", 422));
    } else {

      res.status(200).json({ user: existingUser, token: token });
    }
  } else {
    return next(new httpError("user doesn't exist", 422));
  }
  
  
};

// const getAgriculteurById = async (req, res, next) => {
//   const id = req.params.id;
//   let existingUser;
//   try {
//     existingUser = await agriculteur.findById(id);
//   } catch {
//     const error = new httpError("failed signup try again later", 500);
//     return next(error);
//   }
//   res.json({ agriculteur: existingUser });
// };

const getAllAgriculteur = async (req, res, next) => {
  let existingUser;
  try {
    existingUser = await agriculteur.find();
  } catch {
    const error = new httpError("failed to fetch try again later", 500);
    return next(error);
  }
  res.json({ agriculteurs: existingUser });
};

const deleteAgriculteur = async (req, res, next) => {
  const id = req.params.id;
  let existingUser;

  try {
    existingUser = await agriculteur.findById(id);
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

const updateProfile = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, prenom, email, password, datenaissa, telephone, adresse, id } =
    req.body;

  let existingUser;
  try {
    existingUser = await agriculteur.findById(id);
    token= "agriculteur";
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  if (!existingUser){
    try {
      existingUser = await ingenieur.findOne({ email: email });
      token= "ingenieur";
    } catch {
      return next(new httpError("Verify your Email", 422));
    }
  }

  

  existingUser.nom = nom;
  existingUser.prenom = prenom;
  existingUser.datenaissa = datenaissa;
  existingUser.email = email;
  if (password !== null){
    let new_password = await bcrypt.hash(password, 8);

    existingUser.password = new_password;
    } 
  existingUser.telephone = telephone;
  existingUser.adresse = adresse;
  

  try {
    existingUser.save();
    // console.log(existingUser);
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }
  //   res.send(existingUser);
  res.status(200).json({ agriculteur: existingUser, token: token });
};

exports.signup = signup;
exports.login = login;
// exports.getAgriculteurById = getAgriculteurById;
exports.getAllAgriculteur = getAllAgriculteur;
exports.deleteAgriculteur = deleteAgriculteur;
exports.updateProfile = updateProfile;

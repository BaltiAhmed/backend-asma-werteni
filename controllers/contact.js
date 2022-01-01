const httpError = require("../models/error");

const Contact = require("../models/contact");

const agriculteur = require("../models/agriculteur"); 

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const ajoutcontact = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new httpError("invalid input passed ", 422));
    }

    const { nom, email, message, id } = req.body;

    let existinguser;
    try {
        existinguser = await agriculteur.findOne({ email: email });
    } catch (err) {
        const error = new httpError("problems!!!", 500);
        return next(error);
    }
    // const payload = { user: "walid.ghouili98@gmail.com" };
    // const token = jwt.sign(payload, 'secret');
    // const token1 = token.split('.');
    // fianl_token = token1[2].substring(0, 10);
    // res.send(fianl_token);

    const createdcontact = new Contact({
        nom,
        email,
        message,
    });

    try {
        await createdcontact.save();
        existinguser.contacts.push(createdcontact);
        await existinguser.save();
    } catch (err) {
        const error = new httpError("failed to save", 500);
        return next(error);
    }

    res.status(201).json({
        contact: createdcontacts,
        massage: "success",
        });

};

exports.ajoutcontact=ajoutcontact;

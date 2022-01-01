const mongoose =require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const schema = mongoose.Schema;

const ingenieurSchema = new schema({
    nom:{type:String,required:true},
    prenom:{type:String,required:true},
    datenaissa:{type:String},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    telephone:{type:String,required:true,minlenght:8},
    adresse:{type:String,required:true},
   
})

ingenieurSchema.plugin(uniqueValidator)

module.exports = mongoose.model('ingenieur',ingenieurSchema)
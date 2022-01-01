const mongoose =require("mongoose")
const schema = mongoose.Schema;

const agriculteurSchema = new schema({
    nom:{type:String,required:true},
    prenom:{type:String,required:true},
    datenaissa:{type:String},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    telephone:{type:String,required:true,minlenght:8},
    adresse:{type:String,required:true},
    reclamations:[{ type: mongoose.Types.ObjectId, required: true, ref: "reclamation" }],
    demandeDiagnostique:[{ type: mongoose.Types.ObjectId, required: true, ref: "demandeDiagnostique" }],
    contacts:[{ type: mongoose.Types.ObjectId, required: true, ref: "contact" }]

})


module.exports = mongoose.model('agriculteur',agriculteurSchema)
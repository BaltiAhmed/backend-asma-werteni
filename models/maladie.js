const mongoose =require("mongoose")
const schema = mongoose.Schema;

const maladieSchema = new schema({
    nom:{type:String,required:true},
    description:{type:String,required:true},
    cause:{type:String,required:true},
    prevension:{type:String,required:true},
    traitements: [{ type: mongoose.Types.ObjectId, required: true, ref: "traitement" }]

})


module.exports = mongoose.model('maladie',maladieSchema)
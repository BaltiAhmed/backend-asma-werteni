const mongoose =require("mongoose")
const schema = mongoose.Schema;

const traitementSchema = new schema({
    description:{type:String,required:true},
    image:{type:String,required:true},
    prix:{type:String,required:true}    
});


module.exports = mongoose.model('traitement',traitementSchema)
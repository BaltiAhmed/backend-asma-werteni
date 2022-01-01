const mongoose =require("mongoose")
const schema = mongoose.Schema;

const contactSchema = new schema({

    nom:{type:String,required:true},
    email:{type:String,required:true},
    message:{type:String,required:true},
   
});


module.exports = mongoose.model('contact',contactSchema);
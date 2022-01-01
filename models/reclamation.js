const mongoose = require("mongoose");
const schema = mongoose.Schema;

const reclamationSchema = new schema({
  date: { type: String, required: true},
  sujet: { type: String, required: true},
  reponse: { type: String},
  // iduser: { type: String},
 
});

module.exports = mongoose.model("reclamation", reclamationSchema);
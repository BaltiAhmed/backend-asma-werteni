const mongoose = require("mongoose");
const schema = mongoose.Schema;

const rapportSchema = new schema({
  date: { type: String, required: true},
  lieu : { type: String, required: true},
  lecture: { type: String, required: true},
 
});

module.exports = mongoose.model("rapport", rapportSchema);
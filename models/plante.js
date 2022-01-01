const mongoose = require("mongoose");
const schema = mongoose.Schema;

const planteSchema = new schema({
  nom: { type: String, required: true},
  type: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  maladies: [{ type: mongoose.Types.ObjectId, required: true, ref: "maladie" }]
  
});

module.exports = mongoose.model("plante", planteSchema);

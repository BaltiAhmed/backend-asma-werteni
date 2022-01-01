const mongoose = require("mongoose");
const schema = mongoose.Schema;

const reponceSchema = new schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  cause: { type: String, required: true },
  description1: { type: String, required: true },
  image1: { type: String, required: true },
  prix1: { type: String, required: true },
  description2: { type: String, required: true },
  image2: { type: String, required: true },
  prix2: { type: String, required: true },
});

module.exports = mongoose.model("reponse", reponceSchema);

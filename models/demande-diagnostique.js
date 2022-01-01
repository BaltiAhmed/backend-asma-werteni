const mongoose = require("mongoose");
const schema = mongoose.Schema;

const demandeDiagnostiqueSchema = new schema({
  type: { type: String, required: true },
  date: { type: String, required: true},
  image: { type: String, required: true },
  couleur: { type: String, required: true },
  feuille: { type: String },
  maladie: { type: String },
  blee: { type: String },
  sympthome: { type: String },
  finished:{type:Boolean,require:true},
  nom_maladie: { type: String },
  detail_maladie: { type: String },
  cause: { type: String },
  med1: { type: String },
  prix1: { type: String },
  med2: { type: String },
  prix2: { type: String },
  med3: { type: String },
  prix3: { type: String },
  reponses: [{ type: mongoose.Types.ObjectId, required: true, ref: "reponse" }],
});

module.exports = mongoose.model(
  "demandeDiagnostique",
  demandeDiagnostiqueSchema
);

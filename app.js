const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

const agriculteurRoute = require("./routes/agriculteur");

const httperror = require("./models/error");

const mongoose = require("mongoose");

const ingenieurRoute = require("./routes/ingenieur");

const AdminRoute = require("./routes/Admin");

const planteRoute = require("./routes/plante");

const maladieRoute = require("./routes/maladie");

const traitementRoute = require("./routes/traitement");

const rapportRoute = require("./routes/rapport");

const reclamationRoute = require("./routes/reclamation");

const contactRoute = require("./routes/contact");

const demandeDiagnostiqueRoutes = require("./routes/demande-diagnostique");

const responceRoute = require("./routes/reponce");

app.use(bodyParser.json());

app.use("/uploads/images/", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/agriculteur", agriculteurRoute);

app.use("/api/ingenieur", ingenieurRoute);

app.use("/api/admin", AdminRoute);
app.use("/api/plante", planteRoute);

app.use("/api/maladie", maladieRoute);
app.use("/api/traitement", traitementRoute);

app.use("/api/reclamation", reclamationRoute);

app.use("/api/rapport", rapportRoute);
app.use("/api/demande", demandeDiagnostiqueRoutes);
app.use("/api/reponce", responceRoute);
app.use("/api/contact", contactRoute);

app.use((req, res, next) => {
  const error = new httperror("could not find that page", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "an unknown error occurred " });
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(
    "mongodb+srv://asma:admin@cluster0.dgqce.mongodb.net/blee?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
    console.log("it works!!")
  })
  .catch((err) => {
    console.log(err);
  });

require("dotenv").config();
const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const userRoutes = require("./routes/users");
const placesRoutes = require("./routes/places");
const tournamentsRoutes = require("./routes/tournaments");
const matchesRoutes = require("./routes/matches");
const {errorHandler} = require("./middlewares/errorHandler");
const app = express();
app.use(express.json());

// Routes registry
app.use("/users", userRoutes);
app.use("/places", placesRoutes);
app.use("/tournaments", tournamentsRoutes);
app.use("/matches", matchesRoutes);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(errorHandler);

exports.app = onRequest(app);

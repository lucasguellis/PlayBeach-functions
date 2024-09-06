const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const userRoutes = require("./routes/users");
const placesRoutes = require("./routes/places");

const app = express();

// Routes registry
app.use("/users", userRoutes);
app.use("/places", placesRoutes);

exports.app = onRequest(app);

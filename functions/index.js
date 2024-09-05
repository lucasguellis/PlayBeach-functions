const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const userRoutes = require("./routes/users");

const app = express();

// Routes registry
app.use("/users", userRoutes);

exports.app = onRequest(app);

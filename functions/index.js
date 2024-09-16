const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const userRoutes = require("./routes/users");
const placesRoutes = require("./routes/places");
const tournamentsRoutes = require("./routes/tournaments");
const categoriesRoutes = require("./routes/categories");
const matchesRoutes = require("./routes/matches");
const {errorHandler} = require("./middlewares/errorHandler");
const app = express();
app.use(express.json());

// Routes registry
app.use("/users", userRoutes);
app.use("/places", placesRoutes);
app.use("/tournaments", tournamentsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/matches", matchesRoutes);

app.use(errorHandler);

exports.app = onRequest(app);

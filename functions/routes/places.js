const express = require("express");
const PlacesController = require("../controllers/places");

const router = express.Router(); // eslint-disable-line

router.get("/", async (req, res) => {
  const places = await PlacesController.getAllPlaces();
  res.status(200).json({places: places});
});

router.get("/:name", async (req, res) => {
  const {name} = req.params;
  const places = await PlacesController.getPlacesByName(name);
  res.status(200).json({places: places});
});

module.exports = router;

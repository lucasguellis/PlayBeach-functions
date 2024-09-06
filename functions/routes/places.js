const express = require("express");
const PlacesController = require("../controllers/places");

const router = express.Router(); // eslint-disable-line

router.get("/", async (req, res) => {
  const name = req.query.name;

  let places;
  if (name) {
    places = await PlacesController.getPlacesByName(name);
  } else {
    places = await PlacesController.getAllPlaces();
  }
  res.status(200).json({places: places});
});

router.get("/:placeId", async (req, res) => {
  const {placeId} = req.params;
  const place = await PlacesController.getPlacesById(placeId);
  res.status(200).json({place: place});
});

module.exports = router;

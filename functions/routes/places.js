const express = require("express");
const PlacesController = require("../controllers/places");
const Place = require("../models/place");
const {logger} = require("firebase-functions");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const name = req.query.name;

    let places;
    if (name) {
      places = await PlacesController.getPlacesByName(name);
    } else {
      places = await PlacesController.getAllPlaces();
    }
    res.status(200).json({places: places});
  } catch (error) {
    logger.error("Error getting all places:", error);
    res.status(500).json({error: "Failed finding places"});
  }
});

router.get("/:placeId", async (req, res) => {
  try {
    const {placeId} = req.params;
    const place = await PlacesController.getPlacesById(placeId);
    res.status(200).json({place: place});
  } catch (error) {
    logger.error("Error finding place:", error);
    res.status(500).json({error: "Failed finding place"});
  }
});

router.post("/createPlace", async (req, res) => {
  try {
    const placeData = req.body;

    placeData.createdAt = `${Date.now()}`;
    placeData.updatedAt = 0;

    const validationErrors = Place.validate(placeData);
    if (validationErrors.length > 0) {
      return res.status(400).json({errors: validationErrors});
    }

    const newPlace = JSON.parse(JSON.stringify(new Place(placeData)));

    const placeRef = await PlacesController.createPlace(newPlace.id);
    logger.info(`Place added with ID: ${placeRef.id}`);

    res.status(201).json({message: "Place added successfully", id: placeRef.id});
  } catch (error) {
    logger.error("Error adding place:", error);
    res.status(500).json({error: "Failed to add place"});
  }
});

module.exports = router;

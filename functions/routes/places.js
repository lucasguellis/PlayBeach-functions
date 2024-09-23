const express = require("express");
const PlacesController = require("../controllers/places");
const Place = require("../models/place");
const { logger } = require("firebase-functions");
const { AppError } = require('../middlewares/errorHandler');

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const name = req.query.name;

    let places;
    if (name) {
      places = await PlacesController.getPlacesByName(name);
    } else {
      places = await PlacesController.getAllPlaces();
    }

    if (!places) {
      return next(new AppError(404, 'No places found'));
    }

    res.status(200).json({places: places});
  } catch (error) {
    next(new AppError(500, 'Failed finding places', error));
  }
});

router.get("/:placeId", async (req, res, next) => {
  try {
    const {placeId} = req.params;
    const place = await PlacesController.getPlacesById(placeId);

    if (!place) {
      return next(new AppError(404, 'Place not found'));
    }

    res.status(200).json({place: place});
  } catch (error) {
    next(new AppError(500, 'Failed finding place', error));
  }
});

router.post("/createPlace", async (req, res, next) => {
  try {
    const placeData = req.body;

    placeData.createdAt = `${Date.now()}`;
    placeData.updatedAt = 0;

    const validationErrors = Place.validate(placeData);
    if (validationErrors.length > 0) {
      return next(new AppError(400, validationErrors.join(', ')));
    }

    const newPlace = JSON.parse(JSON.stringify(new Place(placeData)));

    const placeRef = await PlacesController.createPlace(newPlace.id);
    logger.info(`Place added with ID: ${placeRef.id}`);

    res.status(201).json({message: "Place added successfully", id: placeRef.id});
  } catch (error) {
    next(new AppError(500, 'Failed to add place', error));
  }
});

router.put("/:placeId", async (req, res, next) => {
  try {
    const {placeId} = req.params;
    const updatedData = req.body;
    updatedData.updatedAt = Date.now();

    const updatedPlace = await PlacesController.updatePlace(placeId, updatedData);

    if (!updatedPlace) {
      return next(new AppError(404, 'Place not found'));
    }

    res.status(200).json({message: "Place updated successfully"});
  } catch (error) {
    next(new AppError(500, 'Failed to update place', error));
  }
});

router.delete("/:placeId", async (req, res, next) => {
  try {
    const {placeId} = req.params;
    const deletedPlace = await PlacesController.deletePlace(placeId);

    if (!deletedPlace) {
      return next(new AppError(404, 'Place not found'));
    }

    res.status(200).json({message: "Place deleted successfully"});
  } catch (error) {
    next(new AppError(500, 'Failed to delete place', error));
  }
});

router.get("/:placeId/getUsers", async (req, res, next) => {
  try {
    const { placeId } = req.params;
    const users = await PlacesController.getUsersByPlaceId(placeId);

    if (!users) {
      return next(new AppError(404, 'No users found for this place'));
    }

    res.status(200).json({users: users});
  } catch (error) {
    next(new AppError(500, 'Failed to get users for place', error));
  }
});

module.exports = router;
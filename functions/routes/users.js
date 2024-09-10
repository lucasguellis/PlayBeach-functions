const express = require("express");
const UserController = require("../controllers/users");
const PlacesController = require("../controllers/places");
const User = require("../models/user");
const {logger} = require("firebase-functions");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const name = req.query.name;

    let users;
    if (name) {
      users = await UserController.getUsersByName(name);
    } else {
      users = await UserController.getAllUsers();
    }
    res.status(200).json({users: users});
  } catch (error) {
    logger.error("Error finding users:", error);
    res.status(500).json({error: "Failed finding users"});
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const {userId} = req.params;
    const user = await UserController.getUserById(userId);
    res.status(200).json({user: user});
  } catch (error) {
    logger.error("Error finding user:", error);
    res.status(500).json({error: "Failed finding user"});
  }
});

router.get("/places/getPlaces", async (req, res) => {
  try {
    const userId = req.query.userId;
    const users = await PlacesController.getPlacesByUserId(userId);
    res.status(200).json({users: users});
  } catch (error) {
    logger.error("Error getting user places:", error);
    res.status(500).json({error: "Failed getting user places"});
  }
});

router.post("/createUser", async (req, res) => {
  try {
    const userData = req.body;

    userData.createdAt = `${Date.now()}`;
    userData.updatedAt = 0;
    userData.lastLogin = 0;

    const validationErrors = User.validate(userData);
    if (validationErrors.length > 0) {
      return res.status(400).json({errors: validationErrors});
    }

    const newUser = JSON.parse(JSON.stringify(new User(userData)));

    const userRef = await UserController.createUser(newUser.id);
    logger.info(`User added with ID: ${userRef.id}`);

    res.status(201).json({message: "User added successfully", id: userRef.id});
  } catch (error) {
    logger.error("Error adding user:", error);
    res.status(500).json({error: "Failed to add user"});
  }
});

module.exports = router;

const express = require("express");
const UserController = require("../controllers/users");
const PlacesController = require("../controllers/places")

const router = express.Router(); // eslint-disable-line

router.get("/", async (req, res) => {
  const name = req.query.name;

  let users;
  if (name) {
    users = await UserController.getUsersByName(name);
  } else {
    users = await UserController.getAllUsers();
  }
  res.status(200).json({users: users});
});

router.get("/:userId", async (req, res) => {
  const {userId} = req.params;
  const user = await UserController.getUserById(userId);
  res.status(200).json({user: user});
});

router.get("/getPlaces", async (req, res) => {
  const userId = req.query.userId;
  const users = await PlacesController.getPlacesByUserId(userId);
  res.status(200).json({users: users});
});

module.exports = router;

const express = require("express");
const UserController = require("../controllers/users");
const PlacesController = require("../controllers/places");
const User = require("../models/user");
const { AppError } = require('../middlewares/errorHandler');

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const name = req.query.name;

    let users;
    if (name) {
      users = await UserController.getUsersByName(name);
    } else {
      users = await UserController.getAllUsers();
    }

    if (!users) {
      return next(new AppError(404, 'No users found'));
    }

    res.status(200).json({users: users});
  } catch (error) {
    next(new AppError(500, 'Failed finding users', error));
  }
});

router.get("/profile/:userId", async (req, res, next) => {
  try {
    const {userId} = req.params;
    const user = await UserController.getUserById(userId);

    if (!user) {
      return next(new AppError(404, 'User not found'));
    }

    res.status(200).json({user: user});
  } catch (error) {
    next(new AppError(500, 'Failed finding user', error));
  }
});

router.get("/:userId/getPlaces", async (req, res, next) => {
  try {
    const {userId} = req.params;
    const places = await UserController.getPlacesByUserId(userId);

    if (!places) {
      return next(new AppError(404, 'No places found for this user'));
    }

    res.status(200).json({places: places});
  } catch (error) {
    next(new AppError(500, 'Failed finding places for user', error));
  }
});

router.post("/createUser", async (req, res, next) => {
  try {
    const userData = req.body;

    userData.createdAt = `${Date.now()}`;
    userData.updatedAt = 0;
    userData.lastLogin = 0;

    const validationErrors = User.validate(userData);
    if (validationErrors.length > 0) {
      return next(new AppError(400, validationErrors.join(', ')));
    }

    const newUser = JSON.parse(JSON.stringify(new User(userData)));

    const userRef = await UserController.createUser(newUser.id);
    
    res.status(201).json({message: "User added successfully", id: userRef.id});
  } catch (error) {
    next(new AppError(500, 'Failed to add user', error));
  }
});

router.put("/updateUser/:userId", async (req, res, next) => {
  try {
    const {userId} = req.params;
    const userData = req.body;

    const updatedUser = await UserController.updateUser(userId, userData);

    if (!updatedUser) {
      return next(new AppError(404, 'User not found'));
    }

    res.status(200).json({message: "User updated successfully", user: updatedUser});
  } catch (error) {
    next(new AppError(500, 'Failed to update user', error));
  }
});

router.delete("/deleteUser/:userId", async (req, res, next) => {
  try {
    const {userId} = req.params;

    const deletedUser = await UserController.deleteUser(userId);

    if (!deletedUser) {
      return next(new AppError(404, 'User not found'));
    }

    res.status(200).json({message: "User deleted successfully"});
  } catch (error) {
    next(new AppError(500, 'Failed to delete user', error));
  }
});

module.exports = router;
const express = require("express");
const UserController = require("../controllers/users");

const router = express.Router(); // eslint-disable-line

router.get("/", async (req, res) => {
  const users = await UserController.getAllUsers();
  res.status(200).json({users: users});
});

router.get("/:name", async (req, res) => {
  const {name} = req.params;
  const users = await UserController.getUsersByName(name);
  res.status(200).json({users: users});
});

module.exports = router;

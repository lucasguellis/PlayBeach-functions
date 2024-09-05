/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const express = require("express");
admin.initializeApp();

const app = express();

app.get("/users", async (req, res) => {
  try {
    const usersSnapshot = await admin.firestore().collection("users").get();
    if (usersSnapshot.empty) {
      logger.info("No matching documents.");
      res.status(404).json({message: "No users found."});
      return;
    }

    const users = usersSnapshot.docs.map((doc) => doc.data());
    res.status(200).json(users);
  } catch (error) {
    logger.error("Error retrieving users:", error);
    res.status(500).json({error: "Failed to retrieve users"});
  }
});

app.get("/users/:name", async (req, res) => {
  try {
    const {name} = req.params;
    const usersSnapshot = await admin.firestore()
        .collection("users")
        .where("name", "==", name)
        .get();

    if (usersSnapshot.empty) {
      logger.info(`No user found with the name: ${name}`);
      res.status(404).json({message: `No user found with the name: ${name}`});
      return;
    }

    const users = usersSnapshot.docs.map((doc) => doc.data());
    res.status(200).json(users);
  } catch (error) {
    logger.error("Error retrieving user:", error);
    res.status(500).json({error: "Failed to retrieve user"});
  }
});


exports.app = onRequest(app);

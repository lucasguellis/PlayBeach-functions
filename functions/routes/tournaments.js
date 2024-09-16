const express = require("express");
const TournamentController = require("../controllers/tournaments");
const Tournament = require("../models/tournament");
const {logger} = require("firebase-functions");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const name = req.query.name;

    let tournaments;
    if (name) {
      tournaments = await TournamentController.getTournamentsByName(name);
    } else {
      tournaments = await TournamentController.getAllTournaments();
    }
    res.status(200).json({tournaments: tournaments});
  } catch (error) {
    logger.error("Error finding tournaments:", error);
    res.status(500).json({error: "Failed finding tournaments"});
  }
});

router.get("/:tournamentId", async (req, res) => {
  try {
    const {tournamentId} = req.params;
    const tournament = await TournamentController.getTournamentById(tournamentId);
    res.status(200).json({tournament: tournament});
  } catch (error) {
    logger.error("Error finding tournament:", error);
    res.status(500).json({error: "Failed finding tournament"});
  }
});

router.post("/createTournament", async (req, res) => {
  try {
    const tournamentData = req.body;

    tournamentData.createdAt = `${Date.now()}`;
    tournamentData.updatedAt = 0;

    const validationErrors = Tournament.validate(tournamentData);
    if (validationErrors.length > 0) {
      return res.status(400).json({errors: validationErrors});
    }

    const newTournament = JSON.parse(JSON.stringify(new Tournament(tournamentData)));

    const tournamentRef = await TournamentController.createTournament(newTournament.id);
    logger.info(`Tournament added with ID: ${tournamentRef.id}`);

    res.status(201).json({message: "Tournament added successfully", id: tournamentRef.id});
  } catch (error) {
    logger.error("Error adding tournament:", error);
    res.status(500).json({error: "Failed to add tournament"});
  }
});

router.put("/:tournamentId", async (req, res) => {
  try {
    const {tournamentId} = req.params;
    const updatedData = req.body;
    updatedData.updatedAt = Date.now();

    await TournamentController.updateTournament(tournamentId, updatedData);
    res.status(200).json({message: "Tournament updated successfully"});
  } catch (error) {
    logger.error("Error updating tournament:", error);
    res.status(500).json({error: "Failed to update tournament"});
  }
});

router.delete("/:tournamentId", async (req, res) => {
  try {
    const {tournamentId} = req.params;
    await TournamentController.deleteTournament(tournamentId);
    res.status(200).json({message: "Tournament deleted successfully"});
  } catch (error) {
    logger.error("Error deleting tournament:", error);
    res.status(500).json({error: "Failed to delete tournament"});
  }
});

module.exports = router;

const express = require("express");
const MatchesController = require("../controllers/matches");
const Match = require("../models/match");
const {logger} = require("firebase-functions");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const matches = await MatchesController.getAllMatches();
    res.status(200).json({matches: matches});
  } catch (error) {
    logger.error("Error finding matches:", error);
    res.status(500).json({error: "Failed finding matches"});
  }
});

router.get("/:matchId", async (req, res) => {
  try {
    const {matchId} = req.params;
    const match = await MatchesController.getMatchById(matchId);
    res.status(200).json({match: match});
  } catch (error) {
    logger.error("Error finding match:", error);
    res.status(500).json({error: "Failed finding match"});
  }
});

router.get("/tournament/:tournamentId", async (req, res) => {
  try {
    const {tournamentId} = req.params;
    const matches = await MatchesController.getMatchesByTournamentId(tournamentId);
    res.status(200).json({matches: matches});
  } catch (error) {
    logger.error("Error finding matches for tournament:", error);
    res.status(500).json({error: "Failed finding matches for tournament"});
  }
});

router.post("/createMatch", async (req, res) => {
  try {
    const matchData = req.body;

    matchData.createdAt = `${Date.now()}`;
    matchData.updatedAt = 0;

    const validationErrors = Match.validate(matchData);
    if (validationErrors.length > 0) {
      return res.status(400).json({errors: validationErrors});
    }

    const newMatch = JSON.parse(JSON.stringify(new Match(matchData)));

    const matchRef = await MatchesController.createMatch(newMatch.id);
    logger.info(`Match added with ID: ${matchRef.id}`);

    res.status(201).json({message: "Match added successfully", id: matchRef.id});
  } catch (error) {
    logger.error("Error adding match:", error);
    res.status(500).json({error: "Failed to add match"});
  }
});

router.put("/:matchId", async (req, res) => {
  try {
    const {matchId} = req.params;
    const updatedData = req.body;
    updatedData.updatedAt = Date.now();

    await MatchesController.updateMatch(matchId, updatedData);
    res.status(200).json({message: "Match updated successfully"});
  } catch (error) {
    logger.error("Error updating match:", error);
    res.status(500).json({error: "Failed to update match"});
  }
});

router.delete("/:matchId", async (req, res) => {
  try {
    const {matchId} = req.params;
    await MatchesController.deleteMatch(matchId);
    res.status(200).json({message: "Match deleted successfully"});
  } catch (error) {
    logger.error("Error deleting match:", error);
    res.status(500).json({error: "Failed to delete match"});
  }
});

module.exports = router;

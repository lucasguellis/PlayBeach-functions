const express = require("express");
const MatchesController = require("../controllers/matches");
const Match = require("../models/match");
const {logger} = require("firebase-functions");
const {AppError} = require("../middlewares/errorHandler");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  try {
    const matches = await MatchesController.getAllMatches();
    if (!matches) {
      return next(new AppError(404, "No matches found"));
    }
    res.status(200).json({matches: matches});
  } catch (error) {
    next(new AppError(500, "Failed finding matches", error));
  }
});

router.get("/:matchId", auth, async (req, res, next) => {
  try {
    const {matchId} = req.params;
    const match = await MatchesController.getMatchById(matchId);
    if (!match) {
      return next(new AppError(404, "Match not found"));
    }
    res.status(200).json({match: match});
  } catch (error) {
    next(new AppError(500, "Failed finding match", error));
  }
});

router.post("/createMatch", auth, async (req, res, next) => {
  try {
    const matchData = req.body;

    matchData.createdAt = `${Date.now()}`;
    matchData.updatedAt = 0;

    const validationErrors = Match.validate(matchData);
    if (validationErrors.length > 0) {
      return next(new AppError(400, validationErrors.join(", ")));
    }

    const newMatch = JSON.parse(JSON.stringify(new Match(matchData)));

    const matchRef = await MatchesController.createMatch(newMatch.id);
    logger.info(`Match added with ID: ${matchRef.id}`);

    res.status(201).json({message: "Match added successfully", id: matchRef.id});
  } catch (error) {
    next(new AppError(500, "Failed to add match", error));
  }
});

router.put("/:matchId", auth, async (req, res, next) => {
  try {
    const {matchId} = req.params;
    const updatedData = req.body;
    updatedData.updatedAt = Date.now();

    const updatedMatch = await MatchesController.updateMatch(matchId, updatedData);
    if (!updatedMatch) {
      return next(new AppError(404, "Match not found"));
    }
    res.status(200).json({message: "Match updated successfully"});
  } catch (error) {
    next(new AppError(500, "Failed to update match", error));
  }
});

router.delete("/:matchId", auth, async (req, res, next) => {
  try {
    const {matchId} = req.params;
    const deletedMatch = await MatchesController.deleteMatch(matchId);
    if (!deletedMatch) {
      return next(new AppError(404, "Match not found"));
    }
    res.status(200).json({message: "Match deleted successfully"});
  } catch (error) {
    next(new AppError(500, "Failed to delete match", error));
  }
});

module.exports = router;

const express = require("express");
const TournamentController = require("../controllers/tournaments");
const Tournament = require("../models/tournament");
const { logger } = require("firebase-functions");
const { AppError } = require('../middlewares/errorHandler');

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const name = req.query.name;

    let tournaments;
    if (name) {
      tournaments = await TournamentController.getTournamentsByName(name);
    } else {
      tournaments = await TournamentController.getAllTournaments();
    }

    if (!tournaments) {
      return next(new AppError(404, 'No tournaments found'));
    }

    res.status(200).json({tournaments: tournaments});
  } catch (error) {
    next(new AppError(500, 'Failed finding tournaments'));
  }
});

router.get("/:tournamentId", async (req, res, next) => {
  try {
    const {tournamentId} = req.params;
    const tournament = await TournamentController.getTournamentById(tournamentId);

    if (!tournament) {
      return next(new AppError(404, 'Tournament not found'));
    }

    res.status(200).json({tournament: tournament});
  } catch (error) {
    next(new AppError(500, 'Failed finding tournament'));
  }
});

router.post("/createTournament", async (req, res, next) => {
  try {
    const tournamentData = req.body;

    tournamentData.createdAt = `${Date.now()}`;
    tournamentData.updatedAt = 0;

    const validationErrors = Tournament.validate(tournamentData);
    if (validationErrors.length > 0) {
      return next(new AppError(400, validationErrors.join(', ')));
    }

    const newTournament = JSON.parse(JSON.stringify(new Tournament(tournamentData)));

    const tournamentRef = await TournamentController.createTournament(newTournament.id);
    logger.info(`Tournament added with ID: ${tournamentRef.id}`);

    res.status(201).json({message: "Tournament added successfully", id: tournamentRef.id});
  } catch (error) {
    next(new AppError(500, 'Failed to add tournament'));
  }
});

router.put("/:tournamentId", async (req, res, next) => {
  try {
    const {tournamentId} = req.params;
    const updatedData = req.body;
    updatedData.updatedAt = Date.now();

    const updatedTournament = await TournamentController.updateTournament(tournamentId, updatedData);

    if (!updatedTournament) {
      return next(new AppError(404, 'Tournament not found'));
    }

    res.status(200).json({message: "Tournament updated successfully"});
  } catch (error) {
    next(new AppError(500, 'Failed to update tournament'));
  }
});

router.delete("/:tournamentId", async (req, res, next) => {
  try {
    const {tournamentId} = req.params;
    const deletedTournament = await TournamentController.deleteTournament(tournamentId);

    if (!deletedTournament) {
      return next(new AppError(404, 'Tournament not found'));
    }

    res.status(200).json({message: "Tournament deleted successfully"});
  } catch (error) {
    next(new AppError(500, 'Failed to delete tournament'));
  }
});

module.exports = router;

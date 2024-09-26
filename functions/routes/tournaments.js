const express = require("express");
const TournamentController = require("../controllers/tournaments");
const MatchesController = require("../controllers/matches");
const Tournament = require("../models/tournament");
const {logger} = require("firebase-functions");
const {AppError} = require("../middlewares/errorHandler");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  try {
    const name = req.query.name;

    let tournaments;
    if (name) {
      tournaments = await TournamentController.getTournamentsByName(name);
    } else {
      tournaments = await TournamentController.getAllTournaments();
    }

    if (!tournaments) {
      return next(new AppError(404, "No tournaments found"));
    }

    res.status(200).json({tournaments: tournaments});
  } catch (error) {
    next(new AppError(500, "Failed finding tournaments", error));
  }
});

router.get("/:tournamentId", auth, async (req, res, next) => {
  try {
    const {tournamentId} = req.params;
    const tournament = await TournamentController.getTournamentById(tournamentId);

    if (!tournament) {
      return next(new AppError(404, "Tournament not found"));
    }

    res.status(200).json({tournament: tournament});
  } catch (error) {
    next(new AppError(500, "Failed finding tournament", error));
  }
});

router.post("/createTournament", auth, async (req, res, next) => {
  try {
    const tournamentData = req.body;

    tournamentData.createdAt = `${Date.now()}`;
    tournamentData.updatedAt = 0;

    const validationErrors = Tournament.validate(tournamentData);
    if (validationErrors.length > 0) {
      return next(new AppError(400, validationErrors.join(", ")));
    }

    const newTournament = JSON.parse(JSON.stringify(new Tournament(tournamentData)));

    const tournamentRef = await TournamentController.createTournament(newTournament.id);
    logger.info(`Tournament added with ID: ${tournamentRef.id}`);

    res.status(201).json({message: "Tournament added successfully", id: tournamentRef.id});
  } catch (error) {
    next(new AppError(500, "Failed to add tournament", error));
  }
});

router.put("/:tournamentId", auth, async (req, res, next) => {
  try {
    const {tournamentId} = req.params;
    const updatedData = req.body;
    updatedData.updatedAt = Date.now();

    const updatedTournament = await TournamentController.updateTournament(tournamentId, updatedData);

    if (!updatedTournament) {
      return next(new AppError(404, "Tournament not found"));
    }

    res.status(200).json({message: "Tournament updated successfully"});
  } catch (error) {
    next(new AppError(500, "Failed to update tournament", error));
  }
});

router.delete("/:tournamentId", auth, async (req, res, next) => {
  try {
    const {tournamentId} = req.params;
    const deletedTournament = await TournamentController.deleteTournament(tournamentId);

    if (!deletedTournament) {
      return next(new AppError(404, "Tournament not found"));
    }

    res.status(200).json({message: "Tournament deleted successfully"});
  } catch (error) {
    next(new AppError(500, "Failed to delete tournament", error));
  }
});

router.post("/:tournamentId/addCategory", auth, async (req, res, next) => {
  try {
    const {tournamentId} = req.params;
    const categoryData = req.body;

    const updatedTournament = await TournamentController.addCategoryToTournament(tournamentId, categoryData);

    if (!updatedTournament) {
      return next(new AppError(404, "Tournament not found"));
    }

    res.status(200).json({message: "Category added to tournament successfully"});
  } catch (error) {
    next(new AppError(500, "Failed to add category to tournament", error));
  }
});

router.get("/:tournamentId/categories", auth, async (req, res, next) => {
  try {
    const {tournamentId} = req.params;
    const name = req.query.name;

    let categories;
    if (name) {
      categories = await TournamentController.getCategoriesByName(tournamentId, name);
    } else {
      categories = await TournamentController.getCategories(tournamentId);
    }

    if (!categories) {
      return next(new AppError(404, "No categories found for this tournament"));
    }

    res.status(200).json({categories: categories});
  } catch (error) {
    next(new AppError(500, "Failed to get categories for tournament", error));
  }
});

router.get("/:tournamentId/categories/:categoryId", auth, async (req, res, next) => {
  try {
    const {tournamentId, categoryId} = req.params;

    const category = await TournamentController.getCategoryById(tournamentId, categoryId);

    if (!category) {
      return next(new AppError(404, "Category not found"));
    }

    res.status(200).json({category: category});
  } catch (error) {
    next(new AppError(500, "Failed to get category for tournament", error));
  }
});

router.delete("/:tournamentId/categories/:categoryId", auth, async (req, res, next) => {
  try {
    const {tournamentId, categoryId} = req.params;

    const deletedCategory = await TournamentController.deleteCategoryFromTournament(tournamentId, categoryId);

    if (!deletedCategory) {
      return next(new AppError(404, "Category not found"));
    }

    res.status(200).json({message: "Category deleted successfully"});
  } catch (error) {
    next(new AppError(500, "Failed to delete category from tournament", error));
  }
});

router.put("/:tournamentId/categories/:categoryId", auth, async (req, res, next) => {
  try {
    const {tournamentId, categoryId} = req.params;
    const updatedData = req.body;

    const updatedCategory = await TournamentController.updateCategory(tournamentId, categoryId, updatedData);

    if (!updatedCategory) {
      return next(new AppError(404, "Category not found"));
    }

    res.status(200).json({message: "Category updated successfully"});
  } catch (error) {
    next(new AppError(500, "Failed to update category", error));
  }
});

router.get("/:tournamentId/matches", auth, async (req, res, next) => {
  try {
    const {tournamentId} = req.params;
    const matches = await MatchesController.getByTournamentId(tournamentId);
    if (!matches) {
      return next(new AppError(404, "No matches found for this tournament"));
    }
    res.status(200).json({matches: matches});
  } catch (error) {
    next(new AppError(500, "Failed finding matches for tournament", error));
  }
});

module.exports = router;

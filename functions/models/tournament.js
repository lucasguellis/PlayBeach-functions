const Category = require("./category");

class Tournament {
  constructor(
      id,
      name,
      status,
      createdAt,
      updatedAt,
      placeId,
      categories,
      organizer,
      maxParticipants,
      currentParticipants
  ) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.placeId = placeId;
    this.categories = categories;
    this.organizer = organizer;
    this.maxParticipants = maxParticipants;
    this.currentParticipants = currentParticipants;
  }

  static validate(tournament) {
    const errors = [];

    // Validate name
    if (!tournament.name || typeof tournament.name !== "string" || tournament.name.trim() === "") {
      errors.push("Invalid or missing name");
    }

    // Must be a string and follow specific status types
    const validStatuses = ['open', 'planning', 'registrations open', 'registrations closed', 'in progress', 'paused', 'waiting for next phase', 'canceled', 'completed', 'results pending', 'results published'];
    if (!tournament.status || !validStatuses.includes(tournament.status.toLowerCase())) {
      errors.push("Invalid or missing status");
    }

    if (tournament.updatedAt && isNaN(Date.parse(tournament.updatedAt))) {
      errors.push("Invalid or missing updatedAt date");
    }

    // Should be a string
    if (!tournament.placeId || typeof tournament.placeId !== "string") {
      errors.push("Invalid or missing placeId");
    }

    // Should be an array of valid Category objects
    if (tournament.categories && (!Array.isArray(tournament.categories) || tournament.categories.some((category) => Category.validate(category).length > 0))) {
      errors.push("Invalid categories");
    }

    // Must be a string
    if (!tournament.organizer || typeof tournament.organizer !== "string") {
      errors.push("Invalid or missing organizer");
    }

    // Must be a number
    if (tournament.maxParticipants && (typeof tournament.maxParticipants !== "number" || tournament.maxParticipants < 0)) {
      errors.push("Invalid or missing maxParticipants");
    }

    // Must be a number
    if (tournament.currentParticipants && (typeof tournament.currentParticipants !== "number" || tournament.currentParticipants < 0)) {
      errors.push("Invalid or missing currentParticipants");
    }

    // Validate that currentParticipants is not greater than maxParticipants
    if (tournament.currentParticipants > tournament.maxParticipants) {
      errors.push("currentParticipants cannot be greater than maxParticipants");
    }

    return errors;
  }
}

module.exports = Tournament;

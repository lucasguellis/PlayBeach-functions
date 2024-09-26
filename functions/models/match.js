class Match {
  constructor(
      id,
      status,
      scheduledTime,
      createdAt,
      updatedAt,
      matchType,
      players,
      score,
      winner,
      tournamentPhase,
  ) {
    this.id = id;
    this.status = status;
    this.scheduledTime = scheduledTime;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.matchType = matchType;
    this.players = players;
    this.score = score;
    this.winner = winner;
    this.tournamentPhase = tournamentPhase;
  }

  static validate(match) {
    const errors = [];

    // Must be a string and follow specific status types
    const validStatuses = ["scheduling", "scheduled", "waiting", "in progress", "interrupted", "suspended", "finished", "canceled", "postponed", "awaiting result", "result confirmed", "walkover", "abandoned"];
    if (!match.status || !validStatuses.includes(match.status.toLowerCase())) {
      errors.push("Invalid or missing status");
    }

    // Should be valid dates
    if (!match.scheduledTime || isNaN(Date.parse(match.scheduledTime))) {
      errors.push("Invalid or missing scheduledTime");
    }

    if (match.updatedAt && isNaN(Date.parse(match.updatedAt))) {
      errors.push("Invalid or missing updatedAt date");
    }

    // Must be a string
    if (!match.matchType || typeof match.matchType !== "string") {
      errors.push("Invalid or missing matchType");
    }

    // Should be an array of player IDs
    if (match.players && (!Array.isArray(match.players) || match.players.some((player) => typeof player !== "string"))) {
      errors.push("Invalid players");
    }

    // Should be an object or a specific format if required
    if (match.score && typeof match.score !== "object") {
      errors.push("Invalid score format");
    }

    // Should be a string or null if the match is not yet complete
    if (match.winner && typeof match.winner !== "string") {
      errors.push("Invalid winner format");
    }

    // Must be a string and should match the phase types
    const validPhases = ["group stage", "round of 64", "round of 32", "round of 16", "quarterfinal", "semifinal", "third place playoff", "final", "preliminary round", "qualification round", "playoffs"];
    if (!match.tournamentPhase || !validPhases.includes(match.tournamentPhase.toLowerCase())) {
      errors.push("Invalid or missing tournament phase");
    }

    return errors;
  }
}

module.exports = Match;

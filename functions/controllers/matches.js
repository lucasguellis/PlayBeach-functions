const db = require("../config/database");
const {formatObjectList, formatObject} = require("../utils/snapshotFormatter");

const collection = "matches";

exports.getAllMatches = async () => {
  const snapshot = await db.collection(collection).get();
  return formatObjectList(snapshot);
};

exports.getMatchById = async (id) => {
  const snapshot = await db
      .collection(collection)
      .doc(id)
      .get();
  return formatObject(snapshot);
};

exports.getMatchesByTournamentId = async (tournamentId) => {
  const snapshot = await db
      .collection(collection)
      .where("tournamentId", "==", tournamentId)
      .get();
  return formatObjectList(snapshot);
};

exports.createMatch = async (match) => {
  const snapshot = await db.collection(collection).add(match);
  return snapshot;
};

exports.updateMatch = async (id, updatedData) => {
  const snapshot = await db
      .collection(collection)
      .doc(id)
      .update(updatedData);
  return snapshot;
};

exports.deleteMatch = async (id) => {
  const snapshot = await db
      .collection(collection)
      .doc(id)
      .delete();
  return snapshot;
};

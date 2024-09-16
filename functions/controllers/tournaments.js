const db = require("../config/database");
const {formatObjectList, formatObject} = require("../utils/snapshotFormatter");

const collection = "tournaments";

exports.getAllTournaments = async () => {
  const snapshot = await db.collection(collection).get();
  return formatObjectList(snapshot);
};

exports.getTournamentsByName = async (name) => {
  const snapshot = await db
      .collection(collection)
      .where("name", "==", name)
      .get();
  return formatObjectList(snapshot);
};
exports.getTournamentById = async (id) => {
  const snapshot = await db
      .collection(collection)
      .doc(id)
      .get();
  return formatObject(snapshot);
};

exports.createTournament = async (tournament) => {
  const snapshot = await db.collection(collection).add(tournament);
  return snapshot;
};

exports.updateTournament = async (id, updatedData) => {
  const snapshot = await db
      .collection(collection)
      .doc(id)
      .update(updatedData);
  return snapshot;
};

exports.deleteTournament = async (id) => {
  const snapshot = await db
      .collection(collection)
      .doc(id)
      .delete();
  return snapshot;
};

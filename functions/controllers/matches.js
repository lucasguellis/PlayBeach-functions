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

  if (!snapshot.exists) {
    return null;
  }

  return formatObject(snapshot);
};

exports.getByTournamentId = async (tournamentId) => {
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
  const matchRef = db.collection(collection).doc(id);
  const match = await matchRef.get();

  if (!match.exists) {
    return null;
  }

  await matchRef.update(updatedData);
  const updatedMatch = await matchRef.get();
  return formatObject(updatedMatch);
};

exports.deleteMatch = async (id) => {
  const matchRef = db.collection(collection).doc(id);
  const match = await matchRef.get();

  if (!match.exists) {
    return null;
  }

  await matchRef.delete();
  return { id };
};

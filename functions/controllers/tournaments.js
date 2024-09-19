const db = require("../config/database");
const {formatObjectList, formatObject} = require("../utils/snapshotFormatter");

const collection = "tournaments";

exports.getAllTournaments = async () => {
  const snapshot = await db.collection(collection).get();
  return formatObjectList(snapshot);
};

exports.getTournamentsByName = async (name) => {
  const nameLower = name.toLowerCase();
  const nameUpper = nameLower + '\uf8ff';
  
  const snapshot = await db
      .collection(collection)
      .where("nameLower", ">=", nameLower)
      .where("nameLower", "<=", nameUpper)
      .get();
  
  return formatObjectList(snapshot);
};

exports.getTournamentById = async (id) => {
  const snapshot = await db
      .collection(collection)
      .doc(id)
      .get();

  if (!snapshot.exists) {
    return null;
  }

  return formatObject(snapshot);
};

exports.createTournament = async (tournament) => {
  tournament.nameLower = tournament.name.toLowerCase();
  const snapshot = await db.collection(collection).add(tournament);
  return snapshot;
};

exports.updateTournament = async (id, updatedData) => {
  const tournamentRef = db.collection(collection).doc(id);
  const tournament = await tournamentRef.get();

  if (!tournament.exists) {
    return null;
  }

  await tournamentRef.update(updatedData);
  const updatedTournament = await tournamentRef.get();
  return formatObject(updatedTournament);
};

exports.deleteTournament = async (id) => {
  const tournamentRef = db.collection(collection).doc(id);
  const tournament = await tournamentRef.get();

  if (!tournament.exists) {
    return null;
  }

  await tournamentRef.delete();
  return { id };
};

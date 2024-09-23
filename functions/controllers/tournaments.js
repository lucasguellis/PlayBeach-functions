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

exports.addCategoryToTournament = async (tournamentId, category) => {
  const tournamentRef = db.collection(collection).doc(tournamentId);
  const tournamentSnapshot = await tournamentRef.get();

  if (!tournamentSnapshot.exists) {
    return null;
  }

  category.nameLower = category.name.toLowerCase();
  const categoryRef = await tournamentRef.collection('categories').add(category);
  
  const updatedCategory = await categoryRef.get();
  return formatObject(updatedCategory);
};

exports.deleteCategoryFromTournament = async (tournamentId, categoryId) => {
  const tournamentRef = db.collection(collection).doc(tournamentId);
  const categoryRef = tournamentRef.collection('categories').doc(categoryId);

  const categorySnapshot = await categoryRef.get();

  if (!categorySnapshot.exists) {
    return null;
  }

  await categoryRef.delete();

  const updatedTournament = await tournamentRef.get();
  return formatObject(updatedTournament);
};

exports.getCategoriesByTournamentId = async (tournamentId) => {
  const tournamentRef = db.collection(collection).doc(tournamentId);
  const categoriesSnapshot = await tournamentRef.collection('categories').get();

  if (categoriesSnapshot.empty) {
    return [];
  }

  return categoriesSnapshot.docs.map(doc => formatObject(doc));
};
exports.getCategoriesByName = async (tournamentId, name) => {
  const tournamentRef = db.collection(collection).doc(tournamentId);
  const categoriesRef = tournamentRef.collection('categories');

  const nameLower = name.toLowerCase();
  const snapshot = await categoriesRef.where('nameLower', '>=', nameLower).where('nameLower', '<=', nameLower + '\uf8ff').get();

  if (snapshot.empty) {
    return [];
  }

  return formatObjectList(snapshot);
};

exports.getCategories = async (tournamentId) => {
  const tournamentRef = db.collection(collection).doc(tournamentId);
  const categoriesSnapshot = await tournamentRef.collection('categories').get();

  if (categoriesSnapshot.empty) {
    return [];
  }

  return formatObjectList(categoriesSnapshot);
};

exports.getCategoryById = async (tournamentId, categoryId) => {
  const tournamentRef = db.collection(collection).doc(tournamentId);
  const categoryRef = tournamentRef.collection('categories').doc(categoryId);
  const categorySnapshot = await categoryRef.get();

  if (!categorySnapshot.exists) {
    return null;
  }

  return formatObject(categorySnapshot);
};

exports.updateCategory = async (tournamentId, categoryId, updatedData) => {
  const tournamentRef = db.collection(collection).doc(tournamentId);
  const categoryRef = tournamentRef.collection('categories').doc(categoryId);

  const categorySnapshot = await categoryRef.get();

  if (!categorySnapshot.exists) {
    return null;
  }

  await categoryRef.update(updatedData);

  const updatedCategorySnapshot = await categoryRef.get();
  return formatObject(updatedCategorySnapshot);
};

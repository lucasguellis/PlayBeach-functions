const db = require("../config/database");
const {formatObject} = require("../utils/snapshotFormatter");

const collection = "categories";

exports.getCategoryByName = async (name) => {
  const nameLower = name.toLowerCase();
  const nameUpper = nameLower + '\uf8ff';
  
  const tournamentsRef = db.collection("tournaments");
  const snapshot = await tournamentsRef
    .where("categories", "array-contains", {
      nameLower: nameLower,
    })
    .get();

  const results = [];
  snapshot.forEach(doc => {
    const tournament = doc.data();
    const matchingCategories = tournament.categories.filter(
      category => category.nameLower >= nameLower && category.nameLower <= nameUpper
    );
    results.push(...matchingCategories.map(category => ({
      ...category,
      tournamentId: doc.id,
      tournamentName: tournament.name
    })));
  });

  return results;
};

exports.getCategoryById = async (id) => {
  const snapshot = await db
      .collection(collection)
      .doc(id)
      .get();

  if (!snapshot.exists) {
    return null;
  }

  return formatObject(snapshot);
};

exports.updateCategory = async (id, updatedData) => {
  const categoryRef = db.collection(collection).doc(id);
  const category = await categoryRef.get();

  if (!category.exists) {
    return null;
  }

  await categoryRef.update(updatedData);
  const updatedCategory = await categoryRef.get();
  return formatObject(updatedCategory);
};

exports.deleteCategory = async (id) => {
  const categoryRef = db.collection(collection).doc(id);
  const category = await categoryRef.get();

  if (!category.exists) {
    return null;
  }

  await categoryRef.delete();
  return { id };
};

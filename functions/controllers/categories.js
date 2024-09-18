const db = require("../config/database");
const {formatObjectList, formatObject} = require("../utils/snapshotFormatter");

const collection = "categories";

exports.getAllCategories = async () => {
  const snapshot = await db.collection(collection).get();
  return formatObjectList(snapshot);
};

exports.getCategoryByName = async (name) => {
  const snapshot = await db
      .collection(collection)
      .where("name", "==", name)
      .get();
  return formatObjectList(snapshot);
};

exports.getCategoryById = async (id) => {
  const snapshot = await db
      .collection(collection)
      .doc(id)
      .get();
  return formatObject(snapshot);
};

exports.createCategory = async (category) => {
  const snapshot = await db.collection(collection).add(category);
  return snapshot;
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

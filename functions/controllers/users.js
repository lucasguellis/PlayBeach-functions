const db = require("../config/database");
const {formatObjectList, formatObject} = require("../utils/snapshotFormatter");

const collection = "users";

exports.getAllUsers = async () => {
  const snapshot = await db.collection(collection).get();
  return formatObjectList(snapshot);
};

exports.getUsersByName = async (name) => {
  const snapshot = await db
      .collection(collection)
      .where("name", "==", name)
      .get();
  return formatObjectList(snapshot);
};

exports.getUserById = async (id) => {
  const snapshot = await db
      .collection(collection)
      .doc(id)
      .get();
  return formatObject(snapshot);
};

exports.createUser = async (user) => {
  const snapshot = await db.collection(collection).add(user);
  return snapshot;
};

exports.updateUser = async (id, updatedData) => {
  const userRef = db.collection(collection).doc(id);
  const user = await userRef.get();

  if (!user.exists) {
    return null;
  }

  await userRef.update(updatedData);
  const updatedUser = await userRef.get();
  return formatObject(updatedUser);
};

exports.deleteUser = async (id) => {
  const userRef = db.collection(collection).doc(id);
  const user = await userRef.get();

  if (!user.exists) {
    return null;
  }

  await userRef.delete();
  return { id };
};

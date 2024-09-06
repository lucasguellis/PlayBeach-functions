const db = require("../config/database");
const {formatObjects} = require("../utils/snapshotFormatter");

const collection = "users";

exports.getAllUsers = async () => {
  const snapshot = await db.collection(collection).get();
  return formatObjects(snapshot);
};

exports.getUsersByName = async (name) => {
  const snapshot = await db
      .collection(collection)
      .where("name", "==", name)
      .get();
  return formatObjects(snapshot);
};

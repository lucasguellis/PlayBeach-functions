const db = require("../config/database");
const {formatObjectList} = require("../utils/snapshotFormatter");

const collection = "places";

exports.getAllPlaces = async () => {
  const snapshot = await db.collection(collection).get();
  return formatObjectList(snapshot);
};

exports.getPlacesByName = async (name) => {
  const snapshot = await db
      .collection(collection)
      .where("name", "==", name)
      .get();
  return formatObjectList(snapshot);
};

exports.getPlacesByUserId = async (userId) => {
  const snapshot = await db
      .collection(collection)
      .where("users", "array-contains" ,userId)
      .get();
  return formatObjectList(snapshot);
};

const db = require("../config/database");
const {formatObjectList, formatObject} = require("../utils/snapshotFormatter");

const collection = "places";

exports.getAllPlaces = async () => {
  const snapshot = await db.collection(collection).get();
  return formatObjectList(snapshot);
};

exports.getPlacesByName = async (name) => {
  const nameLower = name.toLowerCase();
  const nameUpper = nameLower + '\uf8ff';
  
  const snapshot = await db
      .collection(collection)
      .where("nameLower", ">=", nameLower)
      .where("nameLower", "<=", nameUpper)
      .get();
  
  return formatObjectList(snapshot);
};

exports.getPlacesById = async (id) => {
  const snapshot = await this.getPlaceEntityById(id);

  if (!snapshot.exists) {
    return null;
  }

  return formatObject(snapshot);
};

exports.getPlaceEntityById = async (id) => {
  const snapshot = await db
      .collection(collection)
      .doc(id)
      .get();

  return snapshot;
};

exports.createPlace = async (place) => {
  place.nameLower = place.name.toLowerCase();
  const snapshot = await db.collection(collection).add(place);
  return snapshot;
};

exports.updatePlace = async (id, updatedData) => {
  const placeRef = db.collection(collection).doc(id);
  const place = await placeRef.get();

  if (!place.exists) {
    return null;
  }

  await placeRef.update(updatedData);
  const updatedPlace = await placeRef.get();
  return formatObject(updatedPlace);
};

exports.deletePlace = async (id) => {
  const placeRef = db.collection(collection).doc(id);
  const place = await placeRef.get();

  if (!place.exists) {
    return null;
  }

  await placeRef.delete();
  return { id };
};

exports.getUsersByPlaceId = async (placeId) => {
  const placeRef = await this.getPlaceEntityById(placeId);
  const place = await formatObject(placeRef);
  
  // Convert the users object to an array of user IDs
  const userIds = Object.keys(place.users);

  
  return {userIds: userIds};
};

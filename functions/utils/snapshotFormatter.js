exports.formatObjectList = async (snapshot) => {
  if (snapshot.empty) return null;
  return Promise.all(snapshot.docs.map(async (doc) => {
    const data = doc.data();
    const subcollections = await getSubcollections(doc.ref);
    return {id: doc.id, ...data, ...subcollections};
  }));
};

exports.formatObject = async (snapshot) => {
  if (snapshot.empty) return null;
  const data = snapshot.data();
  const subcollections = await getSubcollections(snapshot.ref);
  return {id: snapshot.id, ...data, ...subcollections};
};

async function getSubcollections(docRef) {
  const collections = await docRef.listCollections();
  const subcollections = {};
  for (const collectionRef of collections) {
    const snapshot = await collectionRef.get();
    subcollections[collectionRef.id] = await exports.formatObjectList(snapshot);
  }
  return subcollections;
}

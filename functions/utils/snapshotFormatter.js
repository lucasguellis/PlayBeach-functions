exports.formatObjects = (snapshot) => {
  if (snapshot.empty) return null;
  return snapshot.docs.map((doc) => {
    return {id: doc.id, ...doc.data()};
  });
};

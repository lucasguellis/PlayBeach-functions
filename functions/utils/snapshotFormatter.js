exports.formatObjects = (snapshot) => {
  if (snapshot.empty) return null;
  return snapshot.docs.map((doc) => doc.data());
};

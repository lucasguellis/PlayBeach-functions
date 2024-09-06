exports.formatObjectList = (snapshot) => {
  if (snapshot.empty) return null;
  return snapshot.docs.map((doc) => {
    return {id: doc.id, ...doc.data()};
  });
};

exports.formatObject = (snapshot) => {
  if (snapshot.empty) return null;
  return {id: snapshot.id, ...snapshot.data()};
};

const Match = require("./match");

class Category {
  constructor(
      id,
      name,
      minAge,
      maxAge,
      gender,
      users,
      matches,
  ) {
    this.id = id;
    this.name = name;
    this.minAge = minAge;
    this.maxAge = maxAge;
    this.gender = gender;
    this.users = users;
    this.matches = matches;
  }

  static validate(category) {
    const errors = [];

    // Validate name
    if (!category.name || typeof category.name !== "string" || category.name.trim() === "") {
      errors.push("Invalid or missing name");
    }

    // Should be numbers and minAge <= maxAge
    if (typeof category.minAge !== "number" || category.minAge < 0) {
      errors.push("Invalid or missing minAge");
    }

    if (typeof category.maxAge !== "number" || category.maxAge < category.minAge) {
      errors.push("Invalid or missing maxAge");
    }

    // Should be one of specific values
    const allowedGenders = ["male", "female", "mixed"];
    if (!category.gender || !allowedGenders.includes(category.gender.toLowerCase())) {
      errors.push("Invalid or missing gender");
    }

    // Should be an array of user IDs
    if (!Array.isArray(category.users) || category.users.some((user) => typeof user !== "string")) {
      errors.push("Invalid users");
    }

    // Should be an array of valid Match objects
    if (category.matches && (!Array.isArray(category.matches) || category.matches.some((match) => Match.validate(match).length > 0))) {
      errors.push("Invalid matches");
    }

    return errors;
  }
}

module.exports = Category;

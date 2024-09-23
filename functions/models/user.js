class User {
  constructor(
      id,
      name,
      surname,
      username,
      email,
      birthday,
      gender,
      isActive,
      createdAt,
      updatedAt,
      lastLogin,
      roles,
      places,
      tournamentsParticipated,
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.email = email;
    this.birthday = birthday;
    this.gender = gender;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastLogin = lastLogin;
    this.roles = roles;
    this.places = places;
    this.tournamentsParticipated = tournamentsParticipated;
  }

  static validate(user) {
    const errors = [];

    // Validate name
    if (!user.name || typeof user.name !== "string" || user.name.trim() === "") {
      errors.push("Invalid or missing name");
    }

    // Validate surname
    if (!user.surname || typeof user.surname !== "string" || user.surname.trim() === "") {
      errors.push("Invalid or missing surname");
    }

    // Validate username
    if (!user.username || typeof user.username !== "string" || user.username.trim() === "") {
      errors.push("Invalid or missing username");
    }

    // Validate email
    if (!user.email || !/^\S+@\S+\.\S+$/.test(user.email)) {
      errors.push("Invalid or missing email");
    }

    // Should be a date string or Date object
    if (!user.birthday || isNaN(Date.parse(user.birthday))) {
      errors.push("Invalid or missing birthday");
    }

    // If required or restricted to specific values
    const allowedGenders = ["male", "female", "other"];
    if (!user.gender || !allowedGenders.includes(user.gender.toLowerCase())) {
      errors.push("Invalid or missing gender");
    }

    // Should be a boolean
    if (typeof user.isActive !== "boolean") {
      errors.push("Invalid or missing isActive status");
    }

    // Should be a valid date
    if (user.updatedAt && isNaN(Date.parse(user.updatedAt))) {
      errors.push("Invalid or missing updatedAt date");
    }

    // Should be a valid date or null
    if (user.lastLogin && isNaN(Date.parse(user.lastLogin))) {
      errors.push("Invalid lastLogin date");
    }

    // Should be an array
    if (!Array.isArray(user.roles) || user.roles.some((role) => typeof role !== "string")) {
      errors.push("Invalid or missing roles");
    }

    // Should be an array
    if (typeof user.places !== "object" || Object.entries(user.places).some(([key, value]) => typeof key !== "string" || value !== true)) {
      errors.push("Invalid or missing places");
    }

    // Should be an array
    if (Array.isArray(user.tournamentsParticipated) && user.tournamentsParticipated.some((tournament) => typeof tournament !== "string")) {
      errors.push("Invalid or missing tournamentsParticipated");
    }

    return errors;
  }
}

module.exports = User;

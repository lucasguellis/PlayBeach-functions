class Place {
  constructor(
      id,
      name,
      email,
      location,
      address,
      isActive,
      createdAt,
      updatedAt,
      usersAdmin,
      users,
      lastTournment,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.location = location;
    this.address = address;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.usersAdmin = usersAdmin;
    this.users = users;
    this.lastTournment = lastTournment;
  }

  static validate(place) {
    const errors = [];

    // Validate name
    if (!place.name || typeof place.name !== "string" || place.name.trim() === "") {
      errors.push("Invalid or missing name");
    }

    // Validate email
    if (!place.email || !/^\S+@\S+\.\S+$/.test(place.email)) {
      errors.push("Invalid or missing email");
    }

    // Should be a valid object or string representation
    if (!place.location || typeof place.location !== "object") {
      errors.push("Invalid or missing location");
    }

    // Validate address
    if (!place.address || typeof place.address !== "string" || place.address.trim() === "") {
      errors.push("Invalid or missing address");
    }

    // Should be a boolean
    if (typeof place.isActive !== "boolean") {
      errors.push("Invalid or missing isActive status");
    }

    // Should be a valid date
    if (place.updatedAt && isNaN(Date.parse(place.updatedAt))) {
      errors.push("Invalid or missing updatedAt date");
    }

    // Should be an array
    if (!Array.isArray(place.usersAdmin) || place.usersAdmin.some((user) => typeof user !== "string")) {
      errors.push("Invalid or missing usersAdmin");
    }

    // Should be an array
    if (typeof place.users !== "object" || Object.entries(place.users).some(([key, value]) => typeof key !== "string" || value !== true)) {
      errors.push("Invalid or missing users");
    }

    // Should be a valid date or null
    if (!place.lastTournment || typeof place.lastTournment !== "object") {
      errors.push("Invalid lastTournment object");
    }

    return errors;
  }
}

module.exports = Place;

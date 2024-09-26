const jwt = require("jsonwebtoken");
const {AppError} = require("./errorHandler");

const authMiddleware = (req, res, next) => {
  const token = req.header("X-Auth-Token");
  if (!token) {
    return next(new AppError(401, "No token provided, authorization denied"));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (err) {
    next(new AppError(401, "Token is not valid"));
  }
};

module.exports = authMiddleware;

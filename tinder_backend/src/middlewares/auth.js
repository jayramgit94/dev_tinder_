const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET;

const adminAuth = (req, res, next) => {
  // logic of checking the admin is autherised
  // if not then send err or validate
  console.log("checked the auth function");

  const token = "xyz";
  const isAdminAuth = token === "xyz";
  if (!isAdminAuth) {
    res.status(401).send("unautherised data");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ success: false, message: "JWT secret is not configured" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    User.findById(decoded.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
      })
      .catch(() => {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
      });
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = {
  adminAuth,
  userAuth,
};

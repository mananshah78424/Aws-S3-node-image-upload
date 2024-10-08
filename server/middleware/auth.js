require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const authHeader = req.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .send({ error: "Please login to complete further actions!" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    // alert("Please login ");
    res.status(400).send({ error: "Please login! Your token has expired!" });
  }
};
const logout = (req, res) => {
  // Clear the JWT token or perform any logout logic
  // For example, you could clear tokens from the client-side if needed.
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = authenticateToken;

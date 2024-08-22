const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { uploadFile, deleteFile } = require("../config/awsConfig"); // Adjust the path based on your setup
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { updateNoficiations } = require("./postAttributesController");
const { log } = require("console");
const loginUser = async (req, res) => {
  console.log("Trying to login");
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    { userId: user.id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  res.json({ token, user });
};
const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");
const registerUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = await bcrypt.hash(password, 10);
  const name = req.body.name;
  const bio = req.body.bio;
  const file = req.file;
  const fileBuffer = file.buffer;
  const fileMimeType = file.mimetype;
  const fileName = generateFileName();
  await uploadFile(fileBuffer, fileName, fileMimeType);

  // Create a new user
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        bio,
        profilepic: fileName,
      },
    });
    console.log("Registered user succesfull");
    updateNoficiations(null, user.id, "register");
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

const userLoggedIn = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

const logoutUser = async (req, res) => {
  console.log("Logged out the user");
};
module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  userLoggedIn,
};

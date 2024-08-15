const { uploadFile, deleteFile } = require("./config/awsConfig");
const auth = require("./middleware/auth");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");

const {
  loginUser,
  registerUser,
  logoutUser,
  userLoggedIn,
} = require("./controllers/authController");

const {
  getComments,
  createComment,
  incrementComments,
  addLike,
  getLikes,
} = require("./controllers/postAttributesController");

const {
  getPosts,
  createPost,
  deletePost,
} = require("./controllers/postFunctionController");

const { getNews } = require("./controllers/newsController");

const dotenv = require("dotenv");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // to parse JSON request bodies

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const prisma = new PrismaClient();

// Fetch posts
app.get("/api/posts", getPosts);

//Create post
app.post("/api/posts", auth, upload.single("image"), createPost);

//Delete post
app.delete("/api/posts/:id", deletePost);

// Fetch comments for a specific post
app.get("/api/posts/:id/comments", getComments);

// Post and update comment for a specific post
app.post("/api/posts/:id/comments", auth, createComment);

app.put("/api/posts/:id/incrementComments", incrementComments);

// Posting a like
app.post("/api/posts/:id/like", auth, addLike);

// Getting total number of likes
app.get("/api/posts/:id/like", getLikes);

//Authentication
app.post("/login", loginUser);
app.post("/register", registerUser);
app.get("/api/me", auth, userLoggedIn);
app.post("/api/logout", auth, logoutUser);

app.get("/api/news", getNews);

app.listen(8080, () => console.log("listening on port 8080"));

// rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' \
// -e "ssh -i ~//Users/mananshah/Documents/ssh/california-manan-mbp" \
// . ubuntu@ec2-18-225-36-105.us-east-2.compute.amazonaws.com:~/app

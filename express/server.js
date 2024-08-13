const { uploadFile, deleteFile } = require("./config/awsConfig");
const auth = require("./middleware/auth");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const {
//   S3Client,
//   PutObjectCommand,
//   GetObjectCommand,
//   DeleteObjectCommand,
// } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const dotenv = require("dotenv");
const crypto = require("crypto");
const sharp = require("sharp");
const { PrismaClient } = require("@prisma/client");
const { log } = require("console");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // to parse JSON request bodies

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const prisma = new PrismaClient();

// const bucketName = process.env.AWS_BUCKET_NAME;
// const regionName = process.env.AWS_BUCKET_REGION;
// const accessKey = process.env.AWS_USER_ACCESS_KEY;
// const secretKey = process.env.AWS_USER_SECRET_KEY;

// const s3 = new S3Client({
//   credentials: {
//     accessKeyId: accessKey,
//     secretAccessKey: secretKey,
//   },
//   region: regionName,
// });

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { created: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            // Any other user fields you need
          },
        },
      },
    });

    // Add the imageUrl field to each post
    const postsWithImageUrl = posts.map((post) => ({
      ...post,
      imageUrl: `https://d3st0nkyboghj9.cloudfront.net/${post.imageName}`,
    }));

    // console.log("Posts are", postsWithImageUrl);
    res.send(postsWithImageUrl);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send({ error: "Failed to fetch posts" });
  }
});

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

app.post("/api/posts", auth, upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const fileBuffer = file.buffer;
    const caption = req.body.caption;
    const imageName = generateFileName();
    console.log("Imagename", imageName);
    await uploadFile(fileBuffer, imageName, file.mimetype);

    const post = await prisma.post.create({
      data: {
        imageName,
        caption,
        user: {
          connect: { id: req.user.userId }, // Connect the user based on the JWT token
        },
      },
      include: {
        user: true, // Include the user data in the response
      },
    });

    console.log(post);
    res.status(201).send(post);
  } catch (error) {
    console.error("Error uploading file", error);
    res.status(500).send({ message: "Error uploading file", error });
  }
});
// function deleteFile(fileName) {
//   const deleteParams = {
//     Bucket: bucketName,
//     Key: fileName,
//   };

//   return s3.send(new DeleteObjectCommand(deleteParams));
// }
app.delete("/api/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  try {
    // Find the post
    const post = await prisma.post.findUnique({ where: { id } });
    // Delete associated comments
    await prisma.comment.deleteMany({ where: { postId: id } });
    //Delete associated likes
    await prisma.like.deleteMany({ where: { postId: id } });
    // Delete the post image from S3
    await deleteFile(post.imageName);
    // Delete the post
    await prisma.post.delete({ where: { id } });

    res.status(200).json(post);
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// Fetch comments for a specific post
app.get("/api/posts/:id/comments", async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: postId },
      orderBy: { createdAt: "desc" }, // Order comments by creation date
    });
    res.status(201).send(comments);
  } catch (error) {
    console.error("Error fetching comments: ", error);
    res.status(500).json({ error: "Failed to fetch comments:", error });
  }
});

// Post comment for a specific post
app.post("/api/posts/:id/comments", auth, async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  console.log("Post ID is", postId);
  const { commentFromPic, userloggedin } = req.body;
  console.log(commentFromPic);
  const userId = req.user.userId;
  if (!userId || !postId) {
    return res.status(400).json({ error: "Content and postId are required" });
  }
  try {
    const comment = await prisma.comment.create({
      data: {
        content: commentFromPic,
        post: { connect: { id: postId } },
        user: { connect: { id: userId } }, // Correctly use the content field
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal server error", error });
  }
});

//Update comment count
app.put("/api/posts/:id/incrementComments", async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  if (isNaN(postId)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  try {
    // Update the totalComments field by incrementing it by 1
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        totalComments: {
          increment: 1,
        },
      },
    });
    res.status(201).send(updatedPost);
  } catch (error) {
    console.error("Error incrementing totalComments:", error);
    res.status(500).json({ error: "Failed to increment totalComments" });
  }
});

// Posting a like
app.post("/api/posts/:id/like", auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId; // Assuming `req.user` contains authenticated user's info
  console.log("USER ID", userId);
  const postId = parseInt(id, 10);

  console.log("Like id:", id);

  if (isNaN(postId)) {
    return res.status(400).json({ message: "Invalid post ID." });
  }

  try {
    // Check if the user has already liked this post
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });

    if (existingLike) {
      return res
        .status(400)
        .json({ message: "User has already liked this post." });
    }

    // Create a new like entry in the `Like` table
    await prisma.like.create({
      data: {
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });

    // Increment the totalLikes count in the `Post` table
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        totalLikes: {
          increment: 1,
        },
      },
    });

    res.json(post);
  } catch (error) {
    console.error("Error liking post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while liking the post." });
  }
});

// Route to get like details
app.get("/api/posts/:id/like", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the post for likes" });
  }
});

//Authentication
app.post("/login", async (req, res) => {
  console.log("Tryint to login");
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

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  res.json({ token, user });
});

app.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
});

app.get("/api/me", auth, async (req, res) => {
  try {
    console.log("Searching for user - me");
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
});
const logout = (req, res) => {
  // Clear the JWT token or perform any logout logic
  // For example, you could clear tokens from the client-side if needed.
  res.status(200).json({ message: "Logged out successfully" });
};
app.post("/api/logout", auth, logout);

app.listen(8080, () => console.log("listening on port 8080"));

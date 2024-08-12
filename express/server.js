const { uploadFile, deleteFile } = require("./config/awsConfig");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
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
  const posts = await prisma.post.findMany({ orderBy: { created: "desc" } });
  for (const post of posts) {
    post.imageUrl = "https://d3st0nkyboghj9.cloudfront.net/" + post.imageName;
  }
  res.send(posts);
});

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

app.post("/api/posts", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const fileBuffer = file.buffer;
    const caption = req.body.caption;
    const imageName = generateFileName();
    // const params = {
    //   Bucket: bucketName,
    //   Key: imageName,
    //   Body: fileBuffer,
    //   ContentType: req.file.mimetype,
    // };

    // const command = new PutObjectCommand(params);
    // await s3.send(command);
    await uploadFile(fileBuffer, imageName, file.mimetype);

    const post = await prisma.post.create({
      data: {
        imageName,
        caption,
      },
    });
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
app.post("/api/posts/:id/comments", async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const { content } = req.body;
  if (!content || !postId) {
    return res.status(400).json({ error: "Content and postId are required" });
  }
  try {
    const comment = await prisma.comment.create({
      data: {
        postId: postId,
        content: content, // Correctly use the content field
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
app.post("/api/posts/:id/like", async (req, res) => {
  const { id } = req.params;
  console.log("Like id:", id);
  try {
    // Increment the like count in the `Like` table
    await prisma.like.create({
      data: {
        postId: parseInt(id),
      },
    });
    // Increment the totalLikes in the `Post` table
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        totalLikes: {
          increment: 1,
        },
      },
    });

    res.status(200).send(post);
  } catch (error) {
    console.error("Error with updating likes");
    res.status(500).json({ error: "An error occurred while liking the post" });
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

app.listen(8080, () => console.log("listening on port 8080"));

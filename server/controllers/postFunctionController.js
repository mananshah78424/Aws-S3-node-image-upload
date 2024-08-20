const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { uploadFile, deleteFile } = require("../config/awsConfig"); // Adjust the path based on your setup
const crypto = require("crypto");

const getThoughts = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const thoughts = await prisma.post.findMany({
    orderBy: { created: "desc" },
    where: { mediaType: "text", userId: userId },
  });
  res.send(thoughts);
};
const getPosts = async (req, res) => {
  try {
    //Get posts in order of date
    const posts = await prisma.post.findMany({
      orderBy: { created: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    //Map the URL with CDN
    const postsWithImageUrl = posts.map((post) => ({
      ...post,
      fileName: `https://d3st0nkyboghj9.cloudfront.net/${post.fileName}`,
    }));

    res.send(postsWithImageUrl);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send({ error: "Failed to fetch posts" });
  }
};

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");
const createPost = async (req, res) => {
  try {
    const mediaType = req.body.mediaType;
    if (mediaType == "text") {
      const thought = req.body.thought;
      const post = await prisma.post.create({
        data: {
          fileName: null,
          caption: thought,
          user: {
            connect: { id: req.user.userId }, // Connect the user based on the JWT token
          },
          mediaType,
        },
        include: {
          user: true, // Include the user data in the response
        },
      });
      res.status(201).send(post);
    } else {
      const file = req.file;
      const fileBuffer = file.buffer;
      const caption = req.body.caption;
      const fileMimeType = file.mimetype;
      const fileName = generateFileName();
      await uploadFile(fileBuffer, fileName, fileMimeType);

      const post = await prisma.post.create({
        data: {
          fileName,
          caption,
          user: {
            connect: { id: req.user.userId }, // Connect the user based on the JWT token
          },
          mediaType,
        },
        include: {
          user: true, // Include the user data in the response
        },
      });
      res.status(201).send(post);
    }
  } catch (error) {
    console.error("Error creating post", error);
    res.status(500).send({ message: "Error uploading file", error });
  }
};

const deletePost = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  try {
    // Find the post
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Delete associated comments
    await prisma.comment.deleteMany({ where: { postId: id } });
    // Delete associated likes
    await prisma.like.deleteMany({ where: { postId: id } });

    // Check if fileName exists before attempting to delete
    if (post.fileName) {
      await deleteFile(post.fileName);
    }

    // Delete the post
    await prisma.post.delete({ where: { id } });
    console.log("Post deleted successfully!");
    res.status(200).json(post);
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

module.exports = {
  getPosts,
  createPost,
  deletePost,
  getThoughts,
};

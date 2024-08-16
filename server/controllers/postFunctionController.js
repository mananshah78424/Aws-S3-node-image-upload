const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { uploadFile, deleteFile } = require("../config/awsConfig"); // Adjust the path based on your setup
const crypto = require("crypto");

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
      imageUrl: `https://d3st0nkyboghj9.cloudfront.net/${post.imageName}`,
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
    const file = req.file;
    const fileBuffer = file.buffer;
    const caption = req.body.caption;
    const imageName = generateFileName();
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

    // console.log(post);
    res.status(201).send(post);
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
    // Delete associated comments
    await prisma.comment.deleteMany({ where: { postId: id } });
    //Delete associated likes
    await prisma.like.deleteMany({ where: { postId: id } });
    // Delete the post image from S3
    await deleteFile(post.imageName);
    // Delete the post
    await prisma.post.delete({ where: { id } });
    console.log("Post deleted succesfully! ");
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
};

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const s3 = require("../config/awsConfig");
const { generateFileName } = require("../utils/fileUtil");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const getPosts = async (req, res) => {
  const posts = await prisma.post.findMany({ orderBy: { created: "desc" } });

  for (const post of posts) {
    post.imageUrl = `https://d3st0nkyboghj9.cloudfront.net/${post.imageName}`;
  }
  res.send(posts);
};

const createPost = async (req, res) => {
  try {
    const file = req.file;
    const caption = req.body.caption;
    const fileBuffer = file.buffer;
    const imageName = generateFileName();

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
      Body: fileBuffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const post = await prisma.post.create({
      data: { imageName, caption },
    });
    res.status(201).send(post);
  } catch (error) {
    console.error("Error uploading file", error);
    res.status(500).send({ message: "Error uploading file", error });
  }
};

const deletePost = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  try {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    await prisma.comment.deleteMany({ where: { postId: id } });
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: post.imageName,
      })
    );
    await prisma.post.delete({ where: { id } });

    res.status(200).json(post);
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

module.exports = { getPosts, createPost, deletePost };

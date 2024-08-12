const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getComments = async (req, res) => {
  const postId = parseInt(req.params.id, 10);

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).send(comments);
  } catch (error) {
    console.error("Error fetching comments: ", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

const addComment = async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const { content } = req.body;

  if (!content || !postId) {
    return res.status(400).json({ error: "Content and postId are required" });
  }

  try {
    const comment = await prisma.comment.create({
      data: { postId, content },
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getComments, addComment };

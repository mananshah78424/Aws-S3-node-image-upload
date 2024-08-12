const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const likePost = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.like.create({ data: { postId: parseInt(id) } });

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { totalLikes: { increment: 1 } },
    });

    res.status(200).send(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while liking the post" });
  }
};

const getPostDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the post" });
  }
};

module.exports = { likePost, getPostDetails };

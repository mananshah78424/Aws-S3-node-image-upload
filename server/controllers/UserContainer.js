const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fetchUserPosts = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const posts = await prisma.post.findMany({
    where: { userId: userId },
  });
  res.send(posts);
};

module.exports = { fetchUserPosts };

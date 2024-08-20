const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { uploadFile, deleteFile } = require("../config/awsConfig"); // Adjust the path based on your setup
const crypto = require("crypto");
const { type } = require("os");
const { log } = require("console");

const getComments = async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: postId },
      orderBy: { createdAt: "desc" },
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
    res.status(201).send(comments);
  } catch (error) {
    console.error("Error fetching comments: ", error);
    res.status(500).send(error);
  }
};

const createComment = async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  console.log("Comment attempt on ", postId);
  const { commentFromPic } = req.body;
  const userId = req.user.userId;

  if (!userId || !postId) {
    return res.status(400).json({ error: "Content and postId are required" });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content: commentFromPic,
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        totalComments: {
          increment: 1,
        },
      },
    });
    updateNoficiations(postId, userId, "comment");
    res.status(201).send(updatedPost);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const incrementComments = async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  console.log(postId);
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
};

const addLike = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId; // Assuming `req.user` contains authenticated user's info
  // console.log("USER ID", userId);
  const postId = parseInt(id, 10);

  // console.log("Like id:", id);

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

    updateNoficiations(postId, userId, "like");

    res.json(post);
  } catch (error) {
    console.error("Error liking post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while liking the post." });
  }
};

const getLikes = async (req, res) => {
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
};

const updateNoficiations = async (postId, userId, type) => {
  const userActionDoneBy = userId; // Logged in User
  const userActionDoneByDetails = await prisma.user.findUniqueOrThrow({
    where: { id: userActionDoneBy },
  });
  const userActionDoneByName = userActionDoneByDetails.name;

  if (type === "comment") {
    const userCommentedPostId = postId; // Post interacting with
    const content = `${userActionDoneByName} commented on your postId: ${userCommentedPostId}`;

    const userToInform = await prisma.post.findFirstOrThrow({
      where: { id: userCommentedPostId },
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
    const userToInformId = userToInform.userId;
    try {
      const notified = await prisma.notification.create({
        data: {
          type: type,
          content: content,
          userIdToInform: userToInformId,
          postId: userCommentedPostId,
        },
      });
      console.log("Data pushed to notifications tab");
    } catch (error) {
      console.error(error);
    }
  } else if (type == "register") {
    try {
      const userActionDoneBy = userId; // Logged in User
      const userActionDoneByDetails = await prisma.user.findUniqueOrThrow({
        where: { id: userActionDoneBy },
      });
      const userActionDoneByName = userActionDoneByDetails.name;
      const content = `${userActionDoneByName} just created an account!`;
      // Find all users except the newly registered one
      const users = await prisma.user.findMany({
        where: {
          id: {
            not: userId,
          },
        },
      });

      // Create notifications for each user
      for (const user of users) {
        await prisma.notification.create({
          data: {
            type: type,
            content: content,
            userIdToInform: user.id,
          },
        });
      }
      console.log("Notifications sent to all users except the new one.");
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  } else if (type === "like") {
    const userActionDoneBy = userId;
    const userActionDoneByDetails = await prisma.user.findUniqueOrThrow({
      where: { id: userActionDoneBy },
    });
    const userActionDoneByName = userActionDoneByDetails.name;
    const userToInform = await prisma.post.findFirstOrThrow({
      where: { id: userCommentedPostId },
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
    const content = `${userActionDoneByName} just liked your post ${postId}`;
    await prisma.notification.create({
      data: {
        type: type,
        content: content,
        userIdToInform: userToInform,
      },
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({});
    res.status(201).send(notifications);
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({
      message: error,
    });
  }
};

module.exports = {
  getComments,
  createComment,
  incrementComments,
  addLike,
  getLikes,
  updateNoficiations,
  getNotifications,
};

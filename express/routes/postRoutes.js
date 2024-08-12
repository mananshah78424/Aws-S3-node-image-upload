const express = require("express");
const router = express.Router();
const upload = require("../utils/multerUtil");
const {
  getPosts,
  createPost,
  deletePost,
} = require("../controllers/postController");

router.get("/", getPosts);
router.post("/", upload.single("image"), createPost);
router.delete("/:id", deletePost);

module.exports = router;

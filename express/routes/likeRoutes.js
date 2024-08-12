const express = require("express");
const router = express.Router();
const { likePost, getPostDetails } = require("../controllers/likeController");

router.post("/:id", likePost);
router.get("/:id", getPostDetails);

module.exports = router;

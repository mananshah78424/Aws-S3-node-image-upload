const express = require("express");
const router = express.Router();
const { getComments, addComment } = require("../controllers/commentController");

router.get("/:id", getComments);
router.post("/:id", addComment);

module.exports = router;

const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// ADD COMMENT
router.post("/add", async (req, res) => {
  try {
    const { postId, userId, text } = req.body;

    const comment = new Comment({
      postId,
      userId,
      text
    });

    await comment.save();

    res.json({ message: "Comment added successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET COMMENTS BY POST
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
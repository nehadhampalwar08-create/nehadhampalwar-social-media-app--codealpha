const express = require("express");
const router = express.Router();
const Like = require("../models/Like");

// LIKE / UNLIKE POST
router.post("/toggle", async (req, res) => {
  try {
    const { postId, userId } = req.body;

    const existing = await Like.findOne({ postId, userId });

    if (existing) {
      await existing.deleteOne();
      return res.json({ message: "Unliked ❌" });
    } else {
      const like = new Like({ postId, userId });
      await like.save();
      return res.json({ message: "Liked ❤️" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET LIKE COUNT
router.get("/:postId", async (req, res) => {
  try {
    const count = await Like.countDocuments({ postId: req.params.postId });
    res.json({ likes: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
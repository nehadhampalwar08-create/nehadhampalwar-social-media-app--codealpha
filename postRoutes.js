const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const multer = require("multer");

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// CREATE POST WITH IMAGE
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { userId, content } = req.body;

    const post = new Post({
      userId,
      content,
      image: req.file ? req.file.filename : ""
    });

    await post.save();

    res.json({ message: "Post created with image ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL POSTS
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
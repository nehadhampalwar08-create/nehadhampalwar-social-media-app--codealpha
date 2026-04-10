const express = require("express");
const router = express.Router();
const User = require("../models/User");

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (user) {
      res.json({
        message: "Login successful ✅",
        userId: user._id,
        name: user.name
      });
    } else {
      res.json({ message: "Invalid credentials ❌" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
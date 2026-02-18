const express = require("express");
const router = express.Router();
const User = require("../models/users");
const { setuserId } = require("../service/auth");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const match = await User.findOne({ email });
  if (match) {
    return res
      .status(400)
      .json({ error: "User already exists", redirectToLogin: true });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      name: name,
      email: email,
      password: hashedPassword,
    };
    await User.create(user);
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
 

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "invalid user" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send({ error: "invalid password" });
    }
    const token = setuserId(user);
    res.cookie("cookie", token,  {
  httpOnly: true,
  secure: true,       // REQUIRED in production (HTTPS)
  sameSite: "none",  // REQUIRED for cross-site (Netlify → Render)
});
    return res.json({ redirectToHome: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("cookie", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  return res.json({ success: true });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/user.js");



router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
  });
  
  // Handle sign-up form submission
router.post("/sign-up", async (req, res) => {
  try {
      const userInDatabase = await User.findOne({ username: req.body.username });
      if (userInDatabase) {
          return res.send("Username already taken.");
      }

      // Proceed with user creation (hash password, save user)
      const newUser = new User({
          username: req.body.username,
          password: req.body.password, // You should hash this before saving
      });

      await newUser.save();
      res.send("User registered successfully!");
  } catch (error) {
      console.error(error);
      res.status(500).send("Error registering user.");
  }
});

  router.post("/sign-up", async (req, res) => {
    res.send("Form submission accepted!");
  });
  

module.exports = router;

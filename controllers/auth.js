const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Ensure this path is correct
const bcrypt = require("bcrypt");

// Render sign-up form
router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});

// Handle sign-up form submission
router.post("/sign-up", async (req, res) => {
    try {
        // Check if username is already taken
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
            return res.send("Username already taken.");
        }

        // Check if password and confirmPassword match
        if (req.body.password !== req.body.confirmPassword) {
            return res.send("Password and Confirm Password must match.");
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);

        // Create new user
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
        });

        await newUser.save();
        res.send("User registered successfully!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error registering user.");
    }
});

// Render sign-in form
router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
});

// Handle sign-in
router.post("/sign-in", async (req, res) => {
    try {
        // First, get the user from the database
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (!userInDatabase) {
            return res.send("Login failed. Please try again.");
        }

        // There is a user! Time to test their password with bcrypt
        const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
        if (!validPassword) {
            return res.send("Login failed. Please try again.");
        }

        // There is a user AND they had the correct password. Time to make a session!
        // Avoid storing the password, even in hashed format, in the session
        // If there is other data you want to save to `req.session.user`, do so here!
        req.session.user = {
            username: userInDatabase.username,
            _id: userInDatabase._id
        };

        // Redirect to the landing page after successful login
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error signing in.");
    }
});

module.exports = router;

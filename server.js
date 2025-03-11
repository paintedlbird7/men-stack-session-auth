// dependencies
const dotenv = require("dotenv");
// configure settings
dotenv.config();

const express = require("express");
// initialize express app
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// tell the app to listen to HTTP requests
app.set("view engine", "ejs");
app.set("views", "./views"); // Ensure this path matches your project structure
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

// Set the port from environment variable or default to 3001
const port = process.env.PORT || 3001;
// rounter code is actually a type of middleware

const authController = require("./controllers/auth.js");
// connect to mongoDB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware, // mount middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// Routes, // mount routes
app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});

app.get("/vip-lounge", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send("Sorry, no guests allowed.");
  }
});

// any http requests from the browser that comes to /auth... 
// will automatically be forwarded to the router code inside th auth controller
// Session middleware
app.use("/auth", authController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

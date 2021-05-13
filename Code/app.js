const express = require("express");
const session = require("express-session");
const app = express();
const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === "number")
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    },
  },
  partialsDir: ["views/partials/"],
});

Handlebars.registerHelper("checklength", function (v1, v2, options) {
  "use strict";
  if (v1.length > v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

app.use(async (req, res, next) => {
  var timestamp = new Date().toUTCString()
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(
  session({
    name: "AuthCookie",
    secret: "secret string",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/feed", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  } else {
    next();
  }
});

app.use("/posts", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  } else {
    next();
  }
});

app.use("/login", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/feed");
  } else {
    next();
  }
});

app.use("/signup", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/feed");
  } else {
    next();
  }
});

app.use("/profile/edit", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/feed");
  } else {
    next();
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});

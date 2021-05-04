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

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthCookie",
    secret: "secret string",
    resave: false,
    saveUninitialized: true,
  })
);

// app.use("/feed", (req, res, next) => {
//   if (!req.session.user) {
//     return res.redirect("/");
//   } else {
//     next();
//   }
// });

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

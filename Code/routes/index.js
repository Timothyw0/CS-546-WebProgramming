const postRoutes = require("./posts");
const userRoutes = require("./users");
const commentRoutes = require("./comment");
const postData = require("../data/posts");
const recipesroutes = require("./recipes");
const session = require("express-session");

const constructorMethod = (app) => {
  app.use("/feed", async (req, res) => {
    res.render("feed/index", {
      // TODO: Need to add in user ID here
      allPosts: await postData.getPartialPosts(req.session.user._id, 0),
    });
  });

  app.use("/posts", postRoutes);
  app.use("/", userRoutes);
  app.use("/recipes", recipesroutes);
  app.use("/comment", commentRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;

const postRoutes = require("./posts");
const userRoutes = require("./users");
const commentRoutes = require("./comment");
const postData = require("../data/posts");
const userData = require("../data/userData");
const recipesRoutes = require("./recipes");
const searchRoutes = require("./search");
const session = require("express-session");

const constructorMethod = (app) => {
  app.use("/feed", async (req, res) => {
    let followingUsers = req.session.user.following;
    let followingList = [];
    for (let i = 0; i < followingUsers.length; i++) {
      const userInfo = await userData.getUserById(followingUsers[i]);
      followingList.push([userInfo.username, userInfo._id]);
    }
    res.render("feed/index", {
      allPosts: await postData.getPartialPosts(req.session.user._id, 0),
      followingUsers: followingList,
      welcomeUsername: req.session.user.username,
    });
  });

  app.use("/posts", postRoutes);
  app.use("/", userRoutes);
  app.use("/recipes", recipesRoutes);
  app.use("/comment", commentRoutes);
  app.use("/search", searchRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;

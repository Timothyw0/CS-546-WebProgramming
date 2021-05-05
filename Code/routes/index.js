const postRoutes = require("./posts");
const userRoutes = require("./users");
const commentRoutes = require('./comment');
const postData = require("../data/posts");

const constructorMethod = (app) => {
  app.use("/feed", async (req, res) => {
    res.render("feed/index", {
      // TODO: Need to add in user ID here
      allPosts: await postData.getPartialPosts("607322eb50dc91a9bc14955b", 0),
    });
  });

  app.use("/posts", postRoutes);
  app.use("/users", userRoutes);
  app.use("/comment", commentRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;

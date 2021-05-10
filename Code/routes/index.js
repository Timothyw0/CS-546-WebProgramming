const postRoutes = require("./posts");
const userRoutes = require("./users");
const commentRoutes = require("./comment");
const postData = require("../data/posts");
<<<<<<< HEAD
const recipesroutes = require("./recipes");
=======
const recipesroutes = require('./recipes');
>>>>>>> 2bc64d24eac3c74a3ea2fba3739e68ff15480056

const constructorMethod = (app) => {
  app.use("/feed", async (req, res) => {
    res.render("feed/index", {
      // TODO: Need to add in user ID here
      allPosts: await postData.getPartialPosts("607322eb50dc91a9bc14955b", 0),
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

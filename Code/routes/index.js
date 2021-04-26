const postRoutes = require("./posts");
const postData = require("../data/posts");

const constructorMethod = (app) => {
  app.use("/feed", async (req, res) => {
    res.render("feed/index", {
      // TODO: Need to add in user ID here
      allPosts: await postData.getAllPosts("607322eb50dc91a9bc14955b"),
    });
  });

  app.use("/posts", postRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;

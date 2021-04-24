const postRoutes = require("./posts");
const postData = require("../data/posts");

const constructorMethod = (app) => {
  app.use("/feed", async (req, res) => {
    res.render("feed/index", {
      allPosts: await postData.getAllPosts(),
    });
  });

  app.use("/posts", postRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;

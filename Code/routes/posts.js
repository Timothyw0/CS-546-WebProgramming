const express = require("express");
const router = express.Router();
const xss = require("xss");
const postData = require("../data/posts");

// GET localhost:3000/posts/add
// Renders an HTML page with a form to add a new post using AJAX
router.get("/add", async (req, res) => {
  res.render("posts/addPost");
});

// POST localhost:3000/posts/add
// On form submit, this is going to add a new post using the db function
router.post("/add", async (req, res) => {
  let reqBody = req.body;
  // Error check the text and recipe input
  if (reqBody.text.trim().length === 0) {
    throw `Error: No text provided to add new post`;
  }
  if (reqBody.recipe.trim().length === 0) {
    throw `Error: No recipe provided to add new post`;
  }
  // If recipe chosen is None, then we set it to ""
  if (reqBody.recipe === "None") {
    reqBody.recipe = "";
  }
  // Everything looks good, let's call the db function
  // TODO: User creator ID needs to be inputted
  const postSuccess = await postData.addPost(
    "607322eb50dc91a9bc14955b",
    xss(reqBody.recipe),
    xss(reqBody.text)
  );
  if (postSuccess) {
    res.sendStatus(200);
  }
});

// GET localhost:3000/posts/{id}
// Fetch the information related to a specific post because user expanded it
router.get("/:id", async (req, res) => {
  if (!req.params.id) {
    throw `Error: No id provided in get expanded post`;
  }
  res.render("posts/viewPost", {
    data: await postData.getPostById(req.params.id),
  });
});

// POST localhost:3000/posts/like
// User just liked the post that is passed in the body
router.post("/like", async (req, res) => {
  let reqBody = req.body;
  let postID = reqBody.id;
  let userID = reqBody.userID;
  // Error check the body
  if (!postID) {
    throw `Error: No post ID provided in like post route`;
  }
  if (!userID) {
    throw `Error: No user ID provided in like post route`;
  }
  const newLikes = await postData.addLike(postID, userID);
  res.json({ likes: newLikes });
});

// POST localhost:3000/posts/unlike
// User just unliked the post that is passed in the body
router.post("/unlike", async (req, res) => {
  let reqBody = req.body;
  let postID = reqBody.id;
  let userID = reqBody.userID;
  // Error check the body
  if (!postID) {
    throw `Error: No post ID provided in like post route`;
  }
  if (!userID) {
    throw `Error: No user ID provided in like post route`;
  }
  const newLikes = await postData.removeLike(postID, userID);
  res.json({ likes: newLikes });
});

module.exports = router;

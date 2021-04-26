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
    // TODO: Add user session ID here
    data: await postData.getPostById(req.params.id, "607322eb50dc91a9bc14955b"),
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

// GET localhost:3000/posts/edit/{id}
// User clicked on edit post on one of the posts he/she created
router.get("/edit/:id", async (req, res) => {
  if (!req.params.id) {
    throw `Error: No id provided in get expanded post`;
  }
  // Check that the user is authorized to edit this page
  // TODO: Pass in user session ID
  const postInfo = await postData.getPostById(
    req.params.id,
    "607322eb50dc91a9bc14955b"
  );
  if (!postInfo.canEdit) {
    res.sendStatus(403);
  }
  // Everything is good, we can render the edit page
  res.render("posts/editPost", { postInfo: postInfo });
});

// PUT localhost:3000/posts/edit/
// User clicked just filled out edit post form with new text
router.put("/edit", async (req, res) => {
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
  // Get the old post information
  // TODO: Pass in user session ID
  let oldPost = await postData.getPostById(
    reqBody.postID,
    "607322eb50dc91a9bc14955b"
  );
  if (!oldPost.canEdit) {
    res.sendStatus(403);
  }
  // Construct the rest of the post object
  let newPost = {
    creator: oldPost.creator,
    likes: oldPost.likes,
    recipe: xss(reqBody.recipe),
    text: xss(reqBody.text.trim()),
    date: new Date(),
  };

  const postSuccess = await postData.updatePost(reqBody.postID, newPost);
  if (postSuccess) {
    res.sendStatus(200);
  }
});

// PUT localhost:3000/posts/delete
// User just confirmed to delete the post
router.put("/delete", async (req, res) => {
  let reqBody = req.body;
  // Error check that the user is authorized to delete
  // TODO: Pass in user session ID
  let oldPost = await postData.getPostById(
    reqBody.postID,
    "607322eb50dc91a9bc14955b"
  );
  if (!oldPost.canEdit) {
    res.sendStatus(403);
  }
  // It's all good, let's send the request to delete
  const deleteSuccess = await postData.removePost(reqBody.postID);
  if (deleteSuccess) {
    res.sendStatus(200);
  }
});

module.exports = router;

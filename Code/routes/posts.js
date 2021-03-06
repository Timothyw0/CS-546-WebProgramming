const express = require("express");
const router = express.Router();
const xss = require("xss");
const postData = require("../data/posts");
const userData = require("../data/userData");
const recipeData = require("../data/recipes");
let { ObjectId } = require("mongodb");

/*
    HELPER FUNCTIONS TO CHECK USER INPUT 
*/
// Check string function: is string and non empty
// Input: String
// Output: Trimmed/cleaned string
function checkStr(str, param) {
  if (!str) throw `Error: ${param} not provided`;
  if (typeof str !== "string") throw `Error: ${param} is not string`;
  if (str.length === 0) throw `Error: ${param} is empty string`;
  if (!str.trim().length === 0) throw `Error: ${param} is just empty spaces`;
  return str.trim();
}

// GET localhost:3000/posts/add
// Renders an HTML page with a form to add a new post using AJAX
router.get("/add", async (req, res) => {
  // Get all recipes and use that to render the select
  const recipes = await recipeData.getAllRecipes();
  let recipeNames = [];
  for (let i = 0; i < recipes.length; i++) {
    recipeNames.push([recipes[i].recipeName, recipes[i]._id]);
  }
  res.render("posts/addPost", { allRecipes: recipeNames });
});

// GET localhost:3000/posts/all
// Return all posts in JSON format, used for checking for new posts
router.get("/all", async (req, res) => {
  const allPosts = await postData.getFriendPosts(req.session.user._id);
  res.json(allPosts);
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
  const postSuccess = await postData.addPost(
    req.session.user._id,
    xss(reqBody.recipe),
    xss(reqBody.text)
  );
  console.log(postSuccess);
  if (postSuccess) {
    await userData.addPostToUser(
      postSuccess.creator,
      postSuccess._id.toString()
    );
    res.sendStatus(200);
  }
});

// GET localhost:3000/posts/getMorePosts
// Call DB function to get partialPosts when user clicks get more posts
router.get("/getMorePosts", async (req, res) => {
  let skipNum = req.query.skipPosts;
  // Error check the body
  if (!skipNum) {
    throw `Error: No skip posts num provided in get partial posts route`;
  }
  let intSkipNum = parseInt(skipNum);
  if (isNaN(intSkipNum)) {
    throw `Error: Must pass in number to getMorePosts route`;
  }
  let data = await postData.getPartialPosts(req.session.user._id, intSkipNum);
  res.json(data);
});

// GET localhost:3000/posts/{id}
// Fetch the information related to a specific post because user expanded it
router.get("/:id", async (req, res) => {
  if (!req.params.id) {
    throw `Error: No id provided in get expanded post`;
  }
  // Error check id
  let cleanID = checkStr(req.params.id);
  // Try to convert uid into Object ID
  let idObj;
  try {
    idObj = ObjectId(cleanID);
  } catch (e) {
    console.log(e);
    // Not an ID endpoint, throw a 404
    res.sendStatus(404);
  }
  res.render("posts/viewPost", {
    data: await postData.getPostById(req.params.id, req.session.user._id),
  });
});

// POST localhost:3000/posts/like
// User just liked the post that is passed in the body
router.post("/like", async (req, res) => {
  let reqBody = req.body;
  let postID = reqBody.id;
  let userID = req.session.user._id;
  // Error check the body
  if (!postID) {
    throw `Error: No post ID provided in like post route`;
  }
  if (!userID) {
    throw `Error: No user ID provided in like post route`;
  }
  // Error check postID
  let cleanID = checkStr(reqBody.id);
  // Try to convert uid into Object ID
  let idObj;
  try {
    idObj = ObjectId(cleanID);
  } catch (e) {
    // Not an ID endpoint, throw a 404
    res.sendStatus(404);
  }
  // Error check userID
  let cleanID2 = checkStr(userID);
  // Try to convert uid into Object ID
  let idObj2;
  try {
    idObj2 = ObjectId(cleanID2);
  } catch (e) {
    // Not an ID endpoint, throw a 404
    res.sendStatus(404);
  }
  const newLikes = await postData.addLike(postID, userID);
  res.json({ likes: newLikes });
});

// POST localhost:3000/posts/unlike
// User just unliked the post that is passed in the body
router.post("/unlike", async (req, res) => {
  let reqBody = req.body;
  let postID = reqBody.id;
  let userID = req.session.user._id;
  // Error check the body
  if (!postID) {
    throw `Error: No post ID provided in like post route`;
  }
  if (!userID) {
    throw `Error: No user ID provided in like post route`;
  }
  // Error check postID
  let cleanID = checkStr(reqBody.id);
  // Try to convert uid into Object ID
  let idObj;
  try {
    idObj = ObjectId(cleanID);
  } catch (e) {
    // Not an ID endpoint, throw a 404
    res.sendStatus(404);
  }
  // Error check userID
  let cleanID2 = checkStr(userID);
  // Try to convert uid into Object ID
  let idObj2;
  try {
    idObj2 = ObjectId(cleanID2);
  } catch (e) {
    // Not an ID endpoint, throw a 404
    res.sendStatus(404);
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
  // Error check id
  let cleanID = checkStr(req.params.id);
  // Try to convert uid into Object ID
  let idObj;
  try {
    idObj = ObjectId(cleanID);
  } catch (e) {
    // Not an ID endpoint, throw a 404
    res.sendStatus(404);
  }
  // Check that the user is authorized to edit this page
  // TODO: Pass in user session ID
  const postInfo = await postData.getPostById(
    req.params.id,
    req.session.user._id
  );
  if (!postInfo.canEdit) {
    res.sendStatus(403);
  }
  // Everything is good, we can render the edit page
  // Get all recipes and use that to render the select
  const recipes = await recipeData.getAllRecipes();
  let recipeNames = [];
  for (let i = 0; i < recipes.length; i++) {
    recipeNames.push([recipes[i].recipeName, recipes[i]._id]);
  }
  res.render("posts/editPost", { postInfo: postInfo, allRecipes: recipeNames });
});

// PATCH localhost:3000/posts/edit/
// User clicked just filled out edit post form with new text
router.patch("/edit", async (req, res) => {
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
  // Error check id
  let cleanID = checkStr(reqBody.postID);
  // Try to convert uid into Object ID
  let idObj;
  try {
    idObj = ObjectId(cleanID);
  } catch (e) {
    // Not an ID endpoint, throw a 404
    res.sendStatus(404);
  }
  // Get the old post information
  // TODO: Pass in user session ID
  let oldPost = await postData.getPostById(
    reqBody.postID,
    req.session.user._id
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

// DELETE localhost:3000/posts/delete
// User just confirmed to delete the post
router.delete("/delete", async (req, res) => {
  let reqBody = req.body;
  // Error check id
  let cleanID = checkStr(reqBody.postID);
  // Try to convert uid into Object ID
  let idObj;
  try {
    idObj = ObjectId(cleanID);
  } catch (e) {
    // Not an ID endpoint, throw a 404
    res.sendStatus(404);
  }
  // Error check that the user is authorized to delete
  // TODO: Pass in user session ID
  let oldPost = await postData.getPostById(
    reqBody.postID,
    req.session.user._id
  );
  if (!oldPost.canEdit) {
    res.sendStatus(403);
  }
  // It's all good, let's send the request to delete
  const deleteSuccess = await postData.removePost(reqBody.postID);
  if (deleteSuccess) {
    // Remove the post from user collection too
    await userData.removePostToUser(req.session.user._id, reqBody.postID);
    res.sendStatus(200);
  }
});

module.exports = router;

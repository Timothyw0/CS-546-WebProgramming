const express = require("express");
const router = express.Router();
const commentData = require("../data/comment");
const validator = require('../data/validation')

let { ObjectId } = require("mongodb");

router.get('/comment',async(req, res) => {
    res.render('posts/commentForm')
})


//GET localhost:3000/comment/{id}
router.get("/comment/:id", async function (req, res) {
  if (!req.params.id) {
    throw `Error: Please provide id`;
  }
  let parsedId = ObjectId(req.params.id);
  let idObj;
  try {
    idObj = parsedId;
  } catch (e) {
    res.status(404).json({ message: "Comment is not found!" });
  }
  const comment_info = await commentData.getCommentsById(req.params.id);
  res.render("partials/viewComment", {
    title: "comments",
    comments: comment_info,
  });
});


router.post("/comment/new", async (req, res) => {
  let errors = [];
  let postId = xss(req.body.postId.trim());
  let comment = xss(req.body.text.trim());
  let userId = req.session.user._id;
  if (!req.session.user) errors.push("Must log in to comment.");
  if(!validator.validString(postId)) errors.push('Invalid postId.');
  if(!validator.validString(userId)) errors.push('Invalid userId.');
  if(!validator.validString(comment)) errors.push('Invalid comments.');


  if (errors.length > 0) {
    res.status(500).json({
      success: false,
      errors: errors,
      message: "Errors encountered",
    });
  }

  try {
    const commentInfo = await commentData.createComment(postId,userId,comment);
 
    let { username } = await userData.findUserByUsername(userId);
    let commentLayout = {
      name: username,
      comment: commentInfo.comment,
    };
    res.render("partials/viewComment", { layout: null, ...commentLayout });
  } catch (e) {
    errors.push(e);
    res.status(500).json({
      success: false,
      errors: errors,
    });
  }
});

router.get("/", async function (req, res) {
  try {
    const commentList = await commentData.getAllComments();
    res.json(commentList);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/:id", async function (res, req) {
  try {
    const commentListBypost = await commentData.getAllCommentsOfpost;
    res.json(commentListBypost);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/insertData", async (req, res) => {
  let commentInfo = req.body;
  if (!commentInfo) {
    res.status(400).json({ error: "You must provide comment" });
    return;
  }

  const { userId, postId, comment } = commentInfo;

  if (!userId) {
    res.status(400).json({ error: "You must provide user id for the comment" });
    return;
  }
  if (!postId) {
    res.status(400).json({ error: "You must provide post id for the comment" });
    return;
  }
  if (!comment || typeof comment !== "string") {
    res.status(400).json({ error: "Comment content can not be empty." });
    return;
  }

  try {
    const newComment = await commentData.createComment(userId, postId, comment);
    res.status(200).send(newComment);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await commentData.getCommentsById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "No Comment found" });
  }
  try {
    const deleteData = await commentData.removeComment(req.params.id);
    res.status(200).json({ "reviewId": `${req.params.id}`, "deleted": true });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;

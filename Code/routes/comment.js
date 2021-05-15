const express = require("express");
const router = express.Router();
const commentData = require("../data/comment");
const validator = require("../data/validation");
const userData = require("../data/userData");

let { ObjectId } = require("mongodb");

router.get("/comment", async (req, res) => {
  res.render("posts/commentForm");
});

router.get("/addcomment/:id", async function (req, res) {
  res.render("posts/commentForm", {
    title: "comments",
    postId: req.params.id,
    userId: req.session.user._id,
  });
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
    const addCommentToUser = await userData.addCommentToUser(userId, newComment._id.toString());
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
   
      await userData.removeCommentToUser(req.session.user._id, req.params.id);
  
    res.status(200).json({ commentId: `${req.params.id}`, deleted: true });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;

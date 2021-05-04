const express = require("express");
const router = express.Router();
const commentData = require("../data/comment");

let { ObjectId } = require("mongodb");

router.get("/:id", async function (req, res) {
  try {
    const commentInfo = await commentData.getCommentsById(req.params.id);
    res.json(commentInfo);
  } catch (e) {
    res.status(404).json({ message: "Comment is not found!" });
  }
});

router.get("/", async function (req, res) {
  try {
    const commentList = await commentData.getAllComments();
    res.json(commentList);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/:id", async function (res, req) {
  try {
    const commentListBypost = await commentData.getAllCommentsOfpost();
    res.json(commentListBypost);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/", async (req, res) => {
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
  if (!comment || typeof content !== "string") {
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
    const msg = await commentData.removeComment(req.params.id);
    res.status(200).send(msg);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;

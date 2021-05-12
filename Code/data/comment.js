const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
let { ObjectId } = require("mongodb");

//Start database function ********************************

//Get comments by its ID
async function getCommentsById(id) {
  if (!id) throw "Please provide id";
  if (typeof id !== "string") throw "Comment id is not valid string";
  if (id.length === null) throw "Id can not be empty";
  id = id.trim();

  const commentsCollection = await comments();
  let parsedId = ObjectId(id);
  try {
    let parsedId = ObjectId(id);
  } catch (e) {
    console.log("Invalid object id format");
  }

  const findComments = await commentsCollection.findOne({ _id: parsedId });

  if (findComments.length === null) {
    throw `No comments found for ID: ${parsedId}`;
  }
  return findComments;
}

//Get All comments
async function getAllComments() {
  const commentsCollection = await comments();
  const commentsList = await commentsCollection.find({}).toArray();
  return commentsList;
}

//Create Comments
async function createComment(userId, postId, comment) {
  if (!userId || !postId || !comment) throw "Please provide all the details";
  if (typeof userId !== "string") throw "userId is not valid string";
  userId = userId.trim();
  if (typeof postId !== "string") throw "postId is not valid string";
  postId = postId.trim();
  if (typeof comment !== "string")
    throw "Please provide proper type of comment";
  comment = comment.trim();

  //Add comment
  const commentsCollection = await comments();

  let newComments = {
    userId: userId,
    postId: postId,
    comment: comment,
  };

  const insertInfo = await commentsCollection.insertOne(newComments);
  if (insertInfo.insertedCount === 0) {
    throw `Could not insert new comment`;
  }
  return await this.getCommentsById(insertInfo.insertedId.toString());
}


async function removeComment(id) {
  const commentsCollection = await comments();
  if (!id) throw "Please provide id";
  if (typeof id !== "string") throw "Id is not a valid string";
  const deleteInfo = await commentsCollection.removeOne({
    _id: ObjectId(id),
  });
  if (deleteInfo.deletedCount === 0) {
    throw `Error, could not delete post with id ${id}`;
  }
  return;
}

async function updateComment(id, comment) {
  if (!id) throw "Please provide comment id";
  const updatedComments = {};
  if (!comment) {
    throw "Please provide comment for update";
  } else {
    updatedComments.comment = comment;
  }
  let parsedId = ObjectId(id);
  if (typeof id === "string") {
    try {
      let parsedId = ObjectId(id);
    } catch (e) {
      console.log("Invalid object id format");
    }
  }
  const commentsCollection = await comments();
  const updateCommentInfo = await commentsCollection.updateOne(
    { _id: parsedId },
    { $set: updatedComments }
  );

  if (updateCommentInfo.modifiedCount === 0) throw "Could not update comment";

  return await this.getCommentsById(id);
}

async function getAllCommentsOfpost(postId) {
  if (!postId) throw "Please provide valid postId";
  if (typeof postId !== "string") throw "postId is not a valid string";
  postId = postId.trim();
  const commentsCollection = await comments();
  const AllComments = await commentsCollection
    .find({
      postId: { $eq: postId },
    })
    .toArray();

  for (let i of AllComments) {
    i._id = i._id.toString();
  }

  return AllComments;
}

module.exports = {
  getCommentsById,
  getAllComments,
  updateComment,
  createComment,
  removeComment,
  getAllCommentsOfpost,
};

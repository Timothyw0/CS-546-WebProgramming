const mongoCollections = require("../config/mongoCollection");
const comments = mongoCollections.comments;
let { ObjectId } = require("mongodb");

//Start database function ********************************

//Get All comments
async function getAllComments() {
    const commentsCollection = await comments();
    const commentsList = await commentsCollection.find({}).toArray();
    return commentsList;
}

//Get comment by id
async function getCommentsById(id) {
    if (!id) throw `Please provide id`;
    if (id.length < 1) throw 'Id can not be empty';
    const commentsCollection = await comments();
    let parsedId = ObjectId(id);
    try {
        let parsedId = ObjectId(id)
    } catch (e) {
        console.log('Invalid object id format');
    }
    const findComments = await commentsCollection.findOne({ _id: parsedId });
    if (findComments.length === 0) {
        throw `No comments found for ID: ${id}`;
    }
    return findComments;
}

//Add Comments

async function addComments(postId, UserId, comment) {
    if (!postId || !UserId || !comment) throw 'Please provide all the details';
    if (typeof comment !== 'string') throw 'Please provide proper type of comment';
    const commentsCollection = await comments();

    let newComments = {
        postId: postId,
        UserId: UserId,
        comment: comment
    }

    const insertInfo = await commentsCollection.insertOne(newComments);
    if (insertInfo.insertedCount === 0) {
        throw `Could not insert new comment`;
    }
    return await this.getCommentsById(insertInfo.insertedId.toString());
}

//Add comments to user and post

async function addCommentsToUser(commentId, userId) {
    if (!commentId || !userId) throw `Please provide id`;
    let parsedId = ObjectId(commentId);
    try {
        let parsedId = ObjectId(commentId)
    } catch (e) {
        console.log('Invalid object id format');
    }

    const commentsCollection = await this.getCommentsById(commentId);
    if (commentsCollection === null) throw `Comment not found`;

    const updatedComments = commentsCollection.updateOne({ _id: parsedId }, { $push: { comment: userId } });
    if (updatedComments.modifiedCount === 0 && updatedComments.deletedCount === 0) throw 'comment could not be added.';

    return await getUserById(commentId);

}

async function addCommentsToPost(commentId, postId) {
    if (!commentId || !postId) throw `Please provide id`;
    let parsedId = ObjectId(commentId);
    try {
        let parsedId = ObjectId(commentId)
    } catch (e) {
        console.log('Invalid object id format');
    }

    const commentsCollection = await this.getCommentsById(commentId);
    if (commentsCollection === null) throw `Comment not found`;

    const updatedComments = commentsCollection.updateOne({ _id: parsedId }, { $push: { comment: postId } });
    if (updatedComments.modifiedCount === 0 && updatedComments.deletedCount === 0) throw 'comment could not be added.';

    return await getUserById(commentId);

}

async function removeComment(commentId) {
    const commentsCollection = await comments();

    let parsedId = ObjectId(commentId);
    try {
        let parsedId = ObjectId(commentId)
    } catch (e) {
        console.log('Invalid object id format');
    }

    const deleteInfo = await commentsCollection.removeOne({
        _id: ObjectId(parsedId),
    });
    if (deleteInfo.deletedCount === 0) {
        throw `Error, could not delete comment with id ${parsedId}`;
    }
    const removeCommentInfo = { commentId: parsedId, deleted: true };
    return removeCommentInfo;
}




module.exports = {
    getAllComments,
    getCommentsById,
    addComments,
    addCommentsToUser,
    addCommentsToPost,
    removeComment
};

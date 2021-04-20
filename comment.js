const mongoCollections = require("../config/mongoCollection");
const comments = mongoCollections.comments;
const posts = mongoCollections.post;
const users = mongoCollections.user;
let { ObjectId } = require("mongodb");

//Start database function ********************************

//Get All comments
async function getAllComments() {
    const commentsCollection = await comments();
    const commentsList = await commentsCollection.find({}).toArray();
    return commentsList;
}

//Get comments by its ID
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
    // If the array is empty, throw an error
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

//Update Comments

// async function updateComments(commentId, updatedComments) {
//     if (!commentId) throw 'Please provide id';

//     const commentsCollection = await this.getCommentsById(commentId);
//     if (commentsCollection.length === 0) throw 'Comments not found';
//     try {
//         let parsedId = ObjectId(commentId)
//     } catch (e) {
//         console.log('Invalid object id format');
//     }
//     if (updatedComments.userId) {
//         if (!updatedComments.userId) throw `You need to provide userId`;
//         if (typeof updatedComments.userId !== 'string') throw `Please provide proper type of userId`
//     }

//     if (updatedComments.postId) {
//         if (!updatedComments.postId) throw `You need to provide postId`;
//         if (typeof updatedComments.postId !== 'string') throw `Please provide proper type of postId`
//     }

//     if (updatedComments.comment) {
//         if (!updatedComments.comment) throw `You need to provide comment`;
//         if (typeof updatedComments.comment !== 'string') throw `Please provide proper type of comment`;
//     }

//     const updateStatus = await commentsCollection.updateOne(
//         { _id: ObjectId(commentId) },
//         { $set: updatedComments }
//     );
//     if (!updateStatus.matchedCount && !updateStatus.modifiedCount) {
//         throw "Error, update failed";
//     }
//     return await this.getCommentsById(commentId);
// }

async function addCommentsToUser(commentId, userId){
    const commentsCollection = await this.getCommentsById(commentId);
    if(commentsCollection === null) throw `Comments not found`;
    
    const updatedComments = commentsCollection.updateOne({ _id: ObjectId(commentId) }, { $push: { comment: userId } });
    if(updatedComments.modifiedCount === 0 && updatedComments.deletedCount === 0) throw 'Recipe could not be added.';

    return await getUserById(commentId);

}


async function removeComment(commentId) {
    const commentsCollection = await comments();

    let cleanComment = await isComment(commentId);

    const deleteInfo = await commentsCollection.removeOne({
        _id: ObjectId(cleanComment),
    });
    if (deleteInfo.deletedCount === 0) {
        throw `Error, could not delete post with id ${cleanComment}`;
    }
    const returnInfo = { commentId: cleanComment, deleted: true };
    return returnInfo;
}




module.exports = {
    getAllComments,
    getCommentsById,
    addComments,
    //updateComments,
    addCommentsToUser,
    removeComment
};

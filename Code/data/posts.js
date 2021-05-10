const mongoCollections = require("../config/mongoCollections");
const posts = mongoCollections.post;
const users = mongoCollections.user;
const commentData = require("./comment");
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

// Check creator function: should be ObjectID and in user collection
// Input: String
// Output: Trimmed ObjectID
async function isUser(id) {
  const userCollection = await users();
  let cleanCreator = checkStr(id);
  try {
    cleanCreator = ObjectId(cleanCreator);
  } catch (e) {
    throw `${e} in isUser`;
  }
  const isUser = await userCollection.findOne({ _id: cleanCreator });
  if (!isUser) {
    throw `Error, ${id} is not a user in HTML`;
  }
  return cleanCreator.toString();
}

// Check post function: should be ObjectID and in post collection
// Input: String
// Output: Trimmed ObjectID
async function isPost(id) {
  const postCollection = await posts();
  // Error check the post id
  let cleanPost = checkStr(id);
  try {
    cleanPost = ObjectId(cleanPost);
  } catch (e) {
    throw `${e} in isPost`;
  }
  const postList = await postCollection.findOne({ _id: cleanPost });
  if (!postList) {
    throw `Error, ${id} is not a post in HTML`;
  }
  return cleanPost.toString();
}

// Get user's name function
// Input: String objectID
// Output: User's name
async function getName(id) {
  const userCollection = await users();
  // Error check the post id
  let cleanID = checkStr(id);
  try {
    cleanID = ObjectId(cleanID);
  } catch (e) {
    throw `${e} in getName`;
  }
  const isUser = await userCollection.findOne({ _id: cleanID });
  if (!isUser) {
    throw `Error, ${id} is not a user in HTML`;
  }
  return isUser.username;
}

// Check recipe function: should be ObjectID and in post collection
// Input: String
// Output: Trimmed ObjectID
// TODO
async function isRecipe(id) {
  //const recipeCollection = await recipes();
  // Error check the post id
  //   let cleanRecipe = checkStr(id);
  //   try {
  //     cleanRecipe = ObjectId(cleanRecipe);
  //   } catch (e) {
  //     throw e;
  //   }
  //   const recipeList = await recipeCollection.findOne({ _id: cleanRecipe });
  //   if (!recipeList) {
  //     throw `Error, ${id} is not a recipe in HTML`;
  //   }
  //   return cleanRecipe.toString();
}

/*
    BEGIN DATABASE FUNCTIONS
*/
// Get all posts function
// Input: User ID
// Output: List of all posts
async function getAllPosts(id) {
  // Error check the id
  let cleanID = checkStr(id);
  try {
    ObjectId(cleanID);
  } catch (e) {
    throw e;
  }
  // Everything looks good, we can move on
  const postCollection = await posts();
  const postList = await postCollection.find({}).sort({ date: -1 }).toArray();
  // Go through posts and add the usernames to the post and set the likeString to be displayed
  for (let i = 0; i < postList.length; i++) {
    let iLiked = false;
    let likeList = "";
    postList[i].username = await getName(postList[i].creator);
    for (let j = 0; j < postList[i].likes.length; j++) {
      let likeID = postList[i].likes[j];
      let likeName = await getName(likeID);
      likeList += `${likeName}, `;
      // If I already liked set the flag to true
      if (likeName === "timothyw0") {
        iLiked = true;
      }
    }
    postList[i].liked = iLiked;
    if (likeList.length !== 0) {
      postList[i].likeList = likeList.slice(0, -2);
    }
    // Check if this post is the users
    if (postList[i].creator === cleanID) {
      postList[i].canEdit = true;
    }
  }
  return postList;
}

// Get partial posts function, only returns those in your friend's list
// Input: User ID, N - number to skip
// Output: List of 5 posts skipping N number of posts
async function getPartialPosts(id, n) {
  // Error check the id
  let cleanID = checkStr(id);
  try {
    ObjectId(cleanID);
  } catch (e) {
    throw e;
  }
  // Error check n
  if (typeof n !== "number") {
    throw "Error: n is not a number in getPartialPosts";
  }
  // Get friend list
  const friends = await getFriends(id);
  // Everything looks good, we can move on
  const postCollection = await posts();
  const postList = await postCollection
    .find({ creator: { $in: friends } })
    .sort({ date: -1, _id: 1 })
    .limit(3)
    .skip(n * 3)
    .toArray();
  // console.log(postList);
  // console.log(postList.length);
  // Go through posts and add the usernames to the post and set the likeString to be displayed
  for (let i = 0; i < postList.length; i++) {
    // console.log(postList[i]);
    let iLiked = false;
    let likeList = "";
    postList[i].username = await getName(postList[i].creator);
    for (let j = 0; j < postList[i].likes.length; j++) {
      let likeID = postList[i].likes[j];
      let likeName = await getName(likeID);
      likeList += `${likeName}, `;
      // If I already liked set the flag to true
      if (likeName === "timothyw0") {
        iLiked = true;
      }
    }
    postList[i].liked = iLiked;
    if (likeList.length !== 0) {
      postList[i].likeList = likeList.slice(0, -2);
    }
    // Check if this post is the users
    if (postList[i].creator === cleanID) {
      postList[i].canEdit = true;
    }
    // Get the comments and attach them
    let postComments = await commentData.getAllCommentsOfpost(
      postList[i]._id.toString()
    );
    // Get the username of each commentor
    for (let i = 0; i < postComments.length; i++) {
      postComments[i].username = await getName(postComments[i].userId);
    }
    postList[i].comments = postComments;
  }
  return postList;
}

// Get friend's list function
// Input: String of user ID
// Output: Array of friend's list
async function getFriends(uid) {
  const userCollection = await users();
  // Error check uid
  let cleanUID = checkStr(uid);
  // Try to convert uid into Object ID
  let idObj;
  try {
    idObj = ObjectId(cleanUID);
  } catch (e) {
    throw e;
  }
  // Find the user's friend list
  const friendObject = await userCollection.findOne(
    { _id: idObj },
    { projection: { _id: 0, friends: 1 } }
  );
  let friendList = friendObject.friends;
  friendList.push(cleanUID);
  return friendList;
}

// Get all posts based on your friends
// Input: String of user ID
// Output: List of posts that were created by the user's friends
async function getFriendPosts(uid) {
  const postCollection = await posts();
  const userCollection = await users();
  // Error check uid
  let cleanUID = checkStr(uid);
  // Try to convert uid into Object ID
  let idObj;
  try {
    idObj = ObjectId(cleanUID);
  } catch (e) {
    throw e;
  }
  // Find the user's friend list
  const friendObject = await userCollection.findOne(
    { _id: idObj },
    { projection: { _id: 0, friends: 1 } }
  );
  const friendList = friendObject.friends;
  // Now that we have user's friends, get all posts
  const postList = await getAllPosts(cleanUID);
  // Iterate through the postList and only return posts that were created by a friend
  let friendPosts = [];
  for (i = 0; i < postList.length; i++) {
    let currPost = postList[i];
    if (friendList.includes(currPost.creator)) {
      friendPosts.push(currPost);
    }
  }
  return friendPosts;
}

// Get post by user ID function
// Input: userID
// Output: List of all posts by inputted user
async function getPostByUser(userID) {
  // Error check uid
  let cleanUID = await isUser(userID);
  // Get all posts and only return posts by userID
  const postList = await getAllPosts(cleanUID);
  let userPosts = [];
  // Iterate through all posts and add user posts to array
  for (let i = 0; i < postList.length; i++) {
    let currPost = postList[i];
    if (currPost.creator === cleanUID) {
      userPosts.push(currPost);
    }
  }
  return userPosts;
}

// Get post by ID function
// Input: String of post ID and userID
// Output: Single post object
async function getPostById(id, userID) {
  const postCollection = await posts();
  // Error check id
  let cleanID = checkStr(id);
  // Try to convert uid into Object ID
  let idObj;
  try {
    idObj = ObjectId(cleanID);
  } catch (e) {
    throw e;
  }
  // Error check userID
  let cleanUser = checkStr(userID);
  try {
    ObjectId(cleanUser);
  } catch (e) {
    throw e;
  }
  // Find the post by ID
  const reqPost = await postCollection.findOne({ _id: idObj });
  // If the array is empty, throw an error
  if (reqPost.length === 0) {
    throw `No post found for ID: ${cleanID}`;
  }
  // Get the username and usernames of people who liked
  let iLiked = false;
  let likeList = "";
  reqPost.username = await getName(reqPost.creator);
  for (let j = 0; j < reqPost.likes.length; j++) {
    let likeID = reqPost.likes[j];
    let likeName = await getName(likeID);
    likeList += `${likeName}, `;
    // If I already liked set the flag to true
    if (likeName === "timothyw0") {
      iLiked = true;
    }
  }
  reqPost.liked = iLiked;
  if (likeList.length !== 0) {
    reqPost.likeList = likeList.slice(0, -2);
  }
  // If creator is userID, then set canEdit to true
  if (reqPost.creator === cleanUser) {
    reqPost.canEdit = true;
  }
  // Get the comments and attach them
  let postComments = await commentData.getAllCommentsOfpost(cleanID);
  // Get the username of each commentor
  for (let i = 0; i < postComments.length; i++) {
    postComments[i].username = await getName(postComments[i].userId);
  }
  reqPost.comments = postComments;
  return reqPost;
}

// Create post function
// Input: creator string, recipe string (optional), text string
// Output: Newly created post
async function addPost(creator, recipe = "", text) {
  const postCollection = await posts();
  // TODO
  // const recipeCollection = await recipes();

  // Error check creator string, should be ObjectId and it should be a user in user collection
  let cleanCreator = await isUser(creator);
  // Error check recipe
  let cleanRecipe;
  if (recipe.length > 0) {
    // TODO
    // let cleanRecipe = isRecipe(recipe)
  } else {
    cleanRecipe = "";
  }
  // Error check text
  let cleanText = checkStr(text);
  // Everything passed, let's add the new post
  let newPost = {
    creator: cleanCreator,
    likes: [],
    recipe: cleanRecipe,
    text: cleanText,
    date: new Date(),
  };
  // Insert new post
  const newInsert = await postCollection.insertOne(newPost);
  if (newInsert.insertedCount === 0) {
    throw `Error, could not insert new post`;
  }
  return await this.getPostById(newInsert.insertedId.toString(), cleanCreator);
}

// Update post function, this function cannot add/remove likes
// Input: Post ID and object with fields:
//        post id, creator string, recipe string, text string
// Output: Newly updated post
async function updatePost(postID, updatedPost) {
  const postCollection = await posts();
  let newPost = {};
  // Error check the post id
  let cleanPost = await isPost(postID);
  // Check creator field
  if (updatedPost.creator) {
    let cleanCreator;
    try {
      // Error check the creator
      cleanCreator = await isUser(updatedPost.creator);
    } catch (e) {
      throw e;
    }
    newPost.creator = cleanCreator;
  }

  // Error check the recipe
  // TODO
  // let cleanRecipe = isRecipe(recipe)

  // Check text field
  if (updatedPost.text) {
    let cleanText;
    try {
      // Error check the string
      cleanText = checkStr(updatedPost.text);
    } catch (e) {
      throw e;
    }
    newPost.text = cleanText;
  }

  // Everything looks good, let's update
  const updateStatus = await postCollection.updateOne(
    { _id: ObjectId(cleanPost) },
    { $set: newPost }
  );
  if (!updateStatus.matchedCount && !updateStatus.modifiedCount) {
    throw "Error, update failed";
  }
  return await this.getPostById(cleanPost, newPost.creator);
}

// Add like to post function
// Input: Post ID and userID to add to like array
// Output: New likeString
async function addLike(postID, userLiked) {
  const postCollection = await posts();
  // Error check postID
  let cleanPost = await isPost(postID);
  // Error check the userID
  let cleanUser = await isUser(userLiked);
  // Everything looks good let's add user to post array
  const updateStatus = await postCollection.updateOne(
    { _id: ObjectId(cleanPost) },
    { $addToSet: { likes: cleanUser } }
  );
  if (!updateStatus.matchedCount && !updateStatus.modifiedCount) {
    throw "Error, add like failed";
  }
  const newLikes = await this.getPostById(cleanPost, cleanUser);
  return newLikes.likeList;
}

// Remove like from post function
// Input: Post ID and userID to remove from like array
// Output: Newly updated post
async function removeLike(postID, userDisliked) {
  const postCollection = await posts();
  // Error check postID
  let cleanPost = await isPost(postID);
  // Error check the userID
  let cleanUser = await isUser(userDisliked);
  // Everything looks good let's remove the user from post array
  const updateStatus = await postCollection.updateOne(
    { _id: ObjectId(cleanPost) },
    { $pull: { likes: cleanUser } }
  );
  if (!updateStatus.matchedCount && !updateStatus.modifiedCount) {
    throw "Error, remove like failed";
  }
  const newLikes = await this.getPostById(cleanPost, cleanUser);
  return newLikes.likeList;
}

// Remove post function
// Input: Post ID
// Output: Object of {postID, deleted: true} or throws
async function removePost(postID) {
  const postCollection = await posts();
  // Error check postID
  let cleanPost = await isPost(postID);
  // Everything looks good let's remove the post
  const deleteInfo = await postCollection.removeOne({
    _id: ObjectId(cleanPost),
  });
  if (deleteInfo.deletedCount === 0) {
    throw `Error, could not delete post with id ${cleanPost}`;
  }
  const returnInfo = { postID: cleanPost, deleted: true };
  return returnInfo;
}

module.exports = {
  getAllPosts,
  getPartialPosts,
  getFriendPosts,
  getPostById,
  getPostByUser,
  addPost,
  updatePost,
  addLike,
  removeLike,
  removePost,
};

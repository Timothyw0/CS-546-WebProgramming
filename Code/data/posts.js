const mongoCollections = require("../config/mongoCollections");
const posts = mongoCollections.post;
const users = mongoCollections.user;
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
// Input: None
// Output: List of all posts
async function getAllPosts() {
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
  }
  return postList;
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
  const postList = await getAllPosts();
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

// Get post by ID function
// Input: String of post ID
// Output: Single post object
async function getPostById(id) {
  const postCollection = await posts();
  // Error check uid
  let cleanID = checkStr(id);
  // Try to convert uid into Object ID
  let idObj;
  try {
    idObj = ObjectId(cleanID);
  } catch (e) {
    throw e;
  }
  // Find the post by ID
  const reqPost = await postCollection.findOne({ _id: idObj });
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
  // If the array is empty, throw an error
  if (reqPost.length === 0) {
    throw `No post found for ID: ${cleanID}`;
  }
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
  return await this.getPostById(newInsert.insertedId.toString());
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
    try {
      let cleanCreator;
      // Error check the creator
      cleanCreator = await isUser(creator);
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
  return await this.getPostById(cleanPost);
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
  const newLikes = await this.getPostById(cleanPost);
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
  const newLikes = await this.getPostById(cleanPost);
  return newLikes.likeList;
}

// Revmoe post function
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
  getFriendPosts,
  getPostById,
  addPost,
  updatePost,
  addLike,
  removeLike,
  removePost,
};

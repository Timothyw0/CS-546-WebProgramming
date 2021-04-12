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

// TODO: Modify
// Check array function: is array and non empty, all elements should be strings
// Input: Array
// Output: Trimmed/cleaned array
// function checkArr(arr, param) {
//   if (!arr) throw `Error: ${param} not provided`;
//   if (!Array.isArray(arr)) throw `Error: ${param} is not an array`;
//   if (arr.length === 0) throw `Error: ${param} is an empty array`;
//   let cleanArr = [];
//   for (let i = 0; i < arr.length; i++) {
//     cleanArr[i] = checkStr(arr[i], "genre");
//   }
//   return cleanArr;
// }

/*
    BEGIN DATABASE FUNCTIONS
*/
// Get all posts function
// Input: None
// Output: List of all posts
async function getAllPosts() {
  const postCollection = await posts();
  const postList = await postCollection.find({}).toArray();
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
  const friendList = await userCollection
    .findOne({ _id: idObj }, { projection: { _id: 0, friends: 1 } })
    .toArray();
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
  // If the array is empty, throw an error
  if (reqPost.length === 0) {
    throw `No post found for ID: ${cleanID}`;
  }
  return reqPost;
}

module.exports = {
  getAllPosts,
  getFriendPosts,
  getPostById,
};

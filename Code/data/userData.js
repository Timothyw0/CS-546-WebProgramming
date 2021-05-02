const mongoCollections = require('../config/mongoCollections');
const user = mongoCollections.user;
const post = require('../data/posts');
const comment = require('../data/comment');
// const recipe = require('../data/recipe');
const bcrypt = require('bcrypt');
const saltRounds = 16;
const validation = require('./validation');
const { ObjectId } = require('mongodb');


async function getUserById(id) {
    if(!validation.validId(id)) throw 'Invalid User Id input';

    const userCollection = await user();
    let userFound = await userCollection.findOne({ _id: ObjectId(id) });
    if(userFound === null) throw 'no user with provided id';

    userFound._id = userFound._id.toString();
    return userFound;
}

async function getAllUsers() {
    const userCollection = await user();
    const allUsers = userCollection.find({}).toArray();
    for( let singleUser of allUsers) {
        singleUser._id = singleUser._id.toString();
    }

    return allUsers;
}

async function createUser(firstName, lastName, username, email, dateOfBirth, password, friends = [], posts = [], recipes = [], comments = []) {
    if(!validation.validString(firstName)) throw 'First Name must me a string.';
    if(!validation.validString(lastName)) throw 'Last Name must me a string.';
    if(!validation.validString(username)) throw 'Username must me a string.';
    if(!validation.validEmail(email)) throw 'Invalid email address.';
    if(!validation.validAge(dateOfBirth) || !validation.validDate(dateOfBirth)) {
        throw 'Invalid date of birth.';
    }
    if(!validation.validString(password)) throw 'Password must be a string';

    const allUsers = await getAllUsers();
    let usernameLowerCase = username.toLowerCase();
    let emailLowerCase = email.toLowerCase();
    for( let singleUser of allUsers) {
        if(usernameLowerCase == singleUser.username) {
            throw `User with username: ${username} already exists.`
        } else if (emailLowerCase == singleUser.email) {
            throw `User with email: ${email} already exists.`
        }
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let newUser = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        dateOfBirth: dateOfBirth,
        hashedPassword: hashedPassword,
        friends: friends,
        posts: posts,
        recipes: recipes,
        comments: comments,
        profilePicture: ""
    };

    const userCollection = await user();
    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw 'Could not add new user.';

    const addedUser = await getUserById(insertInfo.insertedId.toString());
    return addedUser;
}

async function createSeedUser(_id, firstName, lastName, username, email, dateOfBirth, password, friends = [], posts = [], recipes = [], comments = []) {
    if(!validation.validString(firstName)) throw 'First Name must me a string.';
    if(!validation.validString(lastName)) throw 'Last Name must me a string.';
    if(!validation.validString(username)) throw 'Username must me a string.';
    if(!validation.validEmail(email)) throw 'Invalid email address.';
    if(!validation.validAge(dateOfBirth) || !validation.validDate(dateOfBirth)) {
        throw 'Invalid date of birth.';
    }
    if(!validation.validString(password)) throw 'Password must be a string';

    const allUsers = await getAllUsers();
    let usernameLowerCase = username.toLowerCase();
    let emailLowerCase = email.toLowerCase();
    for( let singleUser of allUsers) {
        if(usernameLowerCase == singleUser.username) {
            throw `User with username: ${username} already exists.`
        } else if (emailLowerCase == singleUser.email) {
            throw `User with email: ${email} already exists.`
        }
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let newUser = {
        _id: _id,
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        dateOfBirth: dateOfBirth,
        hashedPassword: hashedPassword,
        friends: friends,
        posts: posts,
        recipes: recipes,
        comments: comments,
        profilePicture: ""
    };

    const userCollection = await user();
    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw 'Could not add new user.';

    const addedUser = await getUserById(insertInfo.insertedId.toString());
    return addedUser;
}

async function findUserByUsername(username) {
    if (!validation.validString(username)) throw 'invalid username';

    const userCollection = await user();
    const userFound = await userCollection.findOne({ username: username })
    if(userFound === null) throw 'User not found.';

    userFound._id = userFound._id.toString();
    return userFound;
}

async function addFriendToUser(userId, friendId) {
    if (!validation.validId(userId) || !validation.validId(friendId)) throw 'invalid user id';

    const currentUser = await getUserById(userId);
    const friendUser = await getUserById(friendId);

    if(currentUser === null) throw 'User not found';
    if(friendUser === null) throw 'User not found';

    for (let userFriend of currentUser.friends) {
        if(friendId === userFriend) throw 'Already friends with this user.';
    }

    const userCollection = await user();
    const updatedUser = userCollection.updateOne({ _id: ObjectId(userId) }, { $push: { friends: friendId } });
    if(updatedUser.modifiedCount === 0 && updatedUser.deletedCount === 0) throw 'Friend could not be added.';

    return await getUserById(userId);
}

async function addPostToUser(userId, postId) {
    if (!validation.validId(userId)) throw 'invalid user id';
    if (!validation.validId(postId)) throw 'invalid post id';

    const currentUser = await getUserById(userId);
    const postToAdd = await post.getPostById(postId, userId);

    if(currentUser === null) throw 'User not found';
    if(postToAdd === null) throw 'Post not found';
    if(postToAdd.creator !== userId) throw 'Post not created by this user';
    
    for (let userPost of currentUser.posts) {
        if(postId === userPost) throw 'This post is already included';
    }

    const userCollection = await user();
    const updatedUser = userCollection.updateOne({ _id: ObjectId(userId) }, { $push: { posts: postId } });
    if(updatedUser.modifiedCount === 0 && updatedUser.deletedCount === 0) throw 'Post could not be added.';

    return await getUserById(userId);
}

async function addRecipeToUser(userId, recipeId) {
    if (!validation.validId(userId)) throw 'invalid user id';
    if (!validation.validId(recipeId)) throw 'invalid recipe id';

    const currentUser = await getUserById(userId);
    //const recipeToAdd = await getRecipeById(recipeId);

    if(currentUser === null) throw 'User not found';
    //if(recipeToAdd === null) throw 'Recipe not found';
    //if(recipeToAdd.userId !== userId) throw 'Recipe not created by this user';

    for (let userRecipe of currentUser.recipes) {
        if(recipeId === userRecipe) throw 'This recipe is already included';
    }

    const userCollection = await user();
    const updatedUser = userCollection.updateOne({ _id: ObjectId(userId) }, { $push: { recipes: recipeId } });
    if(updatedUser.modifiedCount === 0 && updatedUser.deletedCount === 0) throw 'Recipe could not be added.';

    return await getUserById(userId);
}

async function addCommentToUser(userId, commentId) {
    if (!validation.validId(userId)) throw 'invalid user id';
    if (!validation.validId(commentId)) throw 'invalid comment id';

    const currentUser = await getUserById(userId);
    const commentToAdd = await comment.getCommentsById(commentId);

    if(currentUser === null) throw 'User not found';
    if(commentToAdd === null) throw 'Comment not found';
    if(commentToAdd.userId !== userId) throw 'Comment not created by this user';

    for (let userComment of currentUser.comments) {
        if(commentId === userComment) throw 'This comment is already included';
    }

    const userCollection = await user();
    const updatedUser = userCollection.updateOne({ _id: ObjectId(userId) }, { $push: { comments: commentId } });
    if(updatedUser.modifiedCount === 0 && updatedUser.deletedCount === 0) throw 'Comment could not be added.';

    return await getUserById(userId);
}

module.exports = {
    getUserById,
    getAllUsers,
    createUser,
    createSeedUser,
    findUserByUsername,
    addFriendToUser,
    addPostToUser,
    addRecipeToUser,
    addCommentToUser
}
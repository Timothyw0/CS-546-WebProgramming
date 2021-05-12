const mongoCollections = require('../config/mongoCollections');
const user = mongoCollections.user;
const post = require('../data/posts');
const comment = require('../data/comment');
const recipesData = require('../data/recipes')
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
    if (allUsers.length > 0) {
        for( let singleUser of allUsers) {
            singleUser._id = singleUser._id.toString();
        }
    } else {
        throw 'No Users';
    }

    return allUsers;
}

async function createUser(firstName, lastName, username, email, dateOfBirth, password, following = [], posts = [], recipes = [], comments = []) {
    if(!validation.validString(firstName)) throw 'First Name must be a string.';
    if(!validation.validString(lastName)) throw 'Last Name must be a string.';
    if(!validation.validString(username)) throw 'Username must be a string.';
    if(!validation.validEmail(email)) throw 'Invalid email address.';
    if(!validation.validAge(dateOfBirth) || !validation.validDate(dateOfBirth)) {
        throw 'Invalid date of birth.';
    }
    if(!validation.validPassword(password)) throw 'Invalid Password';

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
        following: following,
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

async function createSeedUser(_id, firstName, lastName, username, email, dateOfBirth, password, following = [], posts = [], recipes = [], comments = []) {
    if(!validation.validString(firstName)) throw 'First Name must me a string.';
    if(!validation.validString(lastName)) throw 'Last Name must me a string.';
    if(!validation.validString(username)) throw 'Username must me a string.';
    if(!validation.validEmail(email)) throw 'Invalid email address.';
    if(!validation.validAge(dateOfBirth) || !validation.validDate(dateOfBirth)) {
        throw 'Invalid date of birth.';
    }
    if(!validation.validPassword(password)) throw 'Password must be a string';

    // const allUsers = await getAllUsers();
    // let usernameLowerCase = username.toLowerCase();
    // let emailLowerCase = email.toLowerCase();
    // for( let singleUser of allUsers) {
    //     if(usernameLowerCase == singleUser.username) {
    //         throw `User with username: ${username} already exists.`
    //     } else if (emailLowerCase == singleUser.email) {
    //         throw `User with email: ${email} already exists.`
    //     }
    // }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let newUser = {
        _id: _id,
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        dateOfBirth: dateOfBirth,
        hashedPassword: hashedPassword,
        following: following,
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
    if(userFound === null) return false;

    userFound._id = userFound._id.toString();
    return userFound;
}

async function addFollowingToUser(userId, followId) {
    if (!validation.validId(userId) || !validation.validId(followId)) throw 'invalid user id';

    const currentUser = await getUserById(userId);
    const followUser = await getUserById(followId);

    if(currentUser === null) throw 'User not found';
    if(followUser === null) throw 'User not found';

    for (let userFollow of currentUser.following) {
        if(followId === userFollow) throw 'Already following with this user.';
    }

    const userCollection = await user();
    const updatedUser = userCollection.updateOne({ _id: ObjectId(userId) }, { $push: { following: followId } });
    if(updatedUser.modifiedCount === 0 && updatedUser.deletedCount === 0) throw 'Could not follow user.';

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
    //userID needs to be added in recipe collection (comment by kishan)
    const recipeToAdd = await recipesData.getRecipeById(recipeId);


    if(currentUser === null) throw 'User not found';
    //if(recipeToAdd === null) throw 'Recipe not found';
    //if(recipeToAdd.userId !== userId) throw 'Recipe not created by this user';
    if(recipeToAdd === null) throw 'Recipe not found';
    if(recipeToAdd.userId !== userId) throw 'Recipe not created by this user';



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

async function updateUser(userId, updatedUser) {
    const userCollection = await user();
    const userToBeUpdated = await getUserById(userId);
    let updateObj = {};
    if (!userToBeUpdated) throw 'No User Found'
    if(!validation.validString(updatedUser.firstName)) throw 'Invalid First Name';
    if(!validation.validString(updatedUser.lastName)) throw 'Invalid Last Name.';
    if(!validation.validString(updatedUser.username)) throw 'Invalid Username.';
    if(!validation.validEmail(updatedUser.email)) throw 'Invalid email address.';
    if(!validation.validAge(dateOfBirth) || !validation.validDate(dateOfBirth)) {
        throw 'Invalid date of birth.';
    }

    if(updatedUser.firstName && updatedUser.firstName !== userToBeUpdated.firstName) {
        updateObj.firstName = updatedUser.firstName;
    }

    if(updatedUser.lastName && updatedUser.lastName !== userToBeUpdated.lastName) {
        updateObj.lastName = updatedUser.lastName;
    }

    if(updatedUser.username && updatedUser.username !== userToBeUpdated.username) {
        updateObj.username = updatedUser.username;
    }

    if(updatedUser.email && updatedUser.email !== userToBeUpdated.email) {
        updateObj.email = updatedUser.email;
    }

    if(updatedUser.dateOfBirth && updatedUser.dateOfBirth !== userToBeUpdated.dateOfBirth) {
        updateObj.dateOfBirth = updatedUser.dateOfBirth;
    }

    const userInfo = await userCollection.updateOne(
        { _id: ObjectId(userId) },
        { $set: updateObj }
    );

    if (!userInfo.matchedCount && !userInfo.modifiedCount) {
        throw 'Could not update user';
    }

    return await getUserById(userId);
}

module.exports = {
    getUserById,
    getAllUsers,
    createUser,
    createSeedUser,
    findUserByUsername,
    addFollowingToUser,
    addPostToUser,
    addRecipeToUser,
    addCommentToUser,
    updateUser
}

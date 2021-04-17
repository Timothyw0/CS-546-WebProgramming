const mongoCollections = require('../config/mongoCollections');
const user = mongoCollections.user;
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
        comments: comments
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

    return userFound;
}

async function addFriendToUser(userId, friendId) {
    if (!validation.validId(userId) || !validation.validId(friendId)) throw 'invalid user id';

    const currentUser = await getUserById(userId);
    const friendUser = await getUserById(friendId);

    if(currentUser === null) throw 'User not found';
    if(friendUser === null) throw 'User not found';

    for (let friend of currentUser.friends) {
        if(friendId === friend) throw 'Already friends with this user.';
    }

    const userCollection = await user();
    const updatedUser = userCollection.updateOne({ _id: ObjectId(userId) }, { $push: { friends: friendId } });
    if(updatedUser.modifiedCount === 0 && updatedUser.deletedCount === 0) throw 'Friend could not be added.';

    return await getUserById(userId);
}

module.exports = {
    getUserById,
    getAllUsers,
    createUser,
    createSeedUser,
    findUserByUsername,
    addFriendToUser
}
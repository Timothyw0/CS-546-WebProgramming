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

module.exports = {
    getUserById,
    getAllUsers,
    createUser,
    createSeedUser
}
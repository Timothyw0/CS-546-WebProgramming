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

module.exports = {
    getUserById
}
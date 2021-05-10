const mongoCollections = require('../config/mongoCollections');
const recipes = mongoCollections.recipes;
const validation = require('./validation');
const { ObjectId } = require('mongodb');

async function getRecipeByAlc (alcoholName) {
    if (!validation.validString(alcoholName)) throw 'Invalid alcohol name';
    let cleanAlc = alcoholName.trim();
    const recipeCollection = await recipes();
    const recipesList = await recipeCollection.find({alcohol: cleanAlc}).toArray();
    for (let recipe of recipesList) {
        recipe._id = recipe._id.toString();
    }

    return recipesList;
}

module.exports = {
    getRecipeByAlc
};
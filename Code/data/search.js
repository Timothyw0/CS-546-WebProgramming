const mongoCollections = require('../config/mongoCollections');
const recipes = mongoCollections.recipes;
const validation = require('./validation');
const { ObjectId } = require('mongodb');
const { getAllRecipes } = require('./recipes');

async function getRecipeByAlc (alcoholName) {
    if (!validation.validString(alcoholName)) throw 'Invalid alcohol name';
    let cleanAlc = alcoholName.trim().toLowerCase();
    const recipeCollection = await recipes();
    
    const recipesList = await recipeCollection.find(
        { alcohol: cleanAlc }
    ).toArray();

    if(recipesList.length < 1 || recipesList == null) throw 'No recipes found'

    for (let recipe of recipesList) {
        recipe._id = recipe._id.toString();
    }

    return recipesList;
}

module.exports = {
    getRecipeByAlc
};
const { recipes } = require('../config/mongoCollections');
const mongoCollections = require('../config/mongoCollections');
const books = mongoCollections.books;
const exportedMethods = {

    async addRecipe(alcohol, ingredients,recipeUser, tasteScale, youtubeLink) {

        const recipesCollections = await recipes();

        const newRecipes = {
            alcohol: alcohol,
            ingredients: ingredients,
            recipeUser:recipeUser,
            tasteScale: tasteScale,
            youtubeLink: youtubeLink,

        };

        const newInsertInformation = await recipesCollections.insertOne(newRecipes);
        if (newInsertInformation.insertedCount === 0) throw 'Could not add recipes';

        var temp = newInsertInformation.insertedId;
        const recipe = await this.getRecipeById(temp);
        return recipe;
    },

    async getRecipeById(id) {
        const recipesCollections = await recipes();
        let { ObjectId } = require('mongodb');
        let parsedId = ObjectId(id);
        const recipe = await recipesCollections.findOne({ _id: parsedId });
        recipe._id = recipe._id.toString();
        if (!recipe) throw 'book not found';
        return recipe;
    },

    async getAllRecipes() {
        const recipesCollections = await recipes();
        const Recipeslist = await recipesCollections.find().toArray();
        for (var i = 0; i < Recipeslist.length; i++) {
            Recipeslist[i]._id = Recipeslist[i]._id.toString();
        }
        return Recipeslist;
    },

    async removeRecipe(id) {
        const recipesCollections = await recipes();
        let { ObjectId } = require('mongodb');
        let parsedId = ObjectId(id);
        const deletionInfo = await recipesCollections.deleteOne({ _id: parsedId });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete Recipe with id of ${id}`;
        }
        var obj = {
            RecipeId: parsedId,
            deleted: true
        }
        return obj
    },

    async patchUpdateRecipe(id, updatedObject) {
        const recipesCollections = await recipes();

        let { ObjectId } = require('mongodb');
        let parsedId = ObjectId(id);

        await recipesCollections.updateOne({ _id: parsedId }, { $set: updatedObject });

        return await this.getRecipeById(id);
    },

    
}

module.exports = exportedMethods;
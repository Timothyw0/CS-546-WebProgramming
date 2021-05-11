const { recipes } = require("../config/mongoCollections");
const mongoCollections = require("../config/mongoCollections");
const exportedMethods = {
  async addRecipe(
    UserId,
    recipeName,
    alcohol,
    ingredients,
    recipeBody,
    tasteScale,
    youtubeLink
  ) {
    try {
      if (typeof recipeName !== "string") throw "Recipe Name is not a string";
      if (typeof alcohol !== "string") throw "Alcohol is not a string";
      if (typeof ingredients !== "string") throw "Ingredients is not a string";
      if (typeof recipeBody !== "string") throw "Recipe is not a string";
      if (typeof tasteScale !== "string") throw "Taste Scale is not a number";
      if (typeof youtubeLink !== "string") throw "Youtube Link is not a string";

      recipeName = recipeName.trim();
      alcohol = alcohol.trim();
      ingredients = ingredients.trim();
      recipeBody = recipeBody.trim();
      youtubeLink = youtubeLink.trim();

      if (
        recipeName.length == 0 ||
        alcohol.length == 0 ||
        ingredients.length == 0 ||
        recipeBody.length == 0
      )
        throw "Any of the field is empty";

      const recipesCollections = await recipes();

      const newRecipes = {
        UserId: UserId,
        recipeName: recipeName,
        alcohol: alcohol,
        ingredients: ingredients,
        recipeBody: recipeBody,
        tasteScale: tasteScale,
        youtubeLink: youtubeLink,
      };

      const newInsertInformation = await recipesCollections.insertOne(
        newRecipes
      );
      if (newInsertInformation.insertedCount === 0)
        throw "Could not add recipes";

      var temp = newInsertInformation.insertedId;
      const recipe = await this.getRecipeById(temp);
      return recipe;
    } catch (e) {
      res.status(500).json({ error: e });
    }
  },

  async getRecipeById(id) {
    const recipesCollections = await recipes();
    let { ObjectId } = require("mongodb");
    let parsedId = ObjectId(id);
    const recipe = await recipesCollections.findOne({ _id: parsedId });
    recipe._id = recipe._id.toString();
    if (!recipe) throw "Recipe not found";
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
    let { ObjectId } = require("mongodb");
    let parsedId = ObjectId(id);
    const deletionInfo = await recipesCollections.deleteOne({ _id: parsedId });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete Recipe with id of ${id}`;
    }
    var obj = {
      RecipeId: parsedId,
      deleted: true,
    };
    return obj;
  },

  async patchUpdateRecipe(id, updatedObject) {
    const recipesCollections = await recipes();

    let { ObjectId } = require("mongodb");
    let parsedId = ObjectId(id);

    await recipesCollections.updateOne(
      { _id: parsedId },
      { $set: updatedObject }
    );

    return await this.getRecipeById(id);
  },
};

module.exports = exportedMethods;

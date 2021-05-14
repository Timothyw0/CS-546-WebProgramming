const express = require("express");
const router = express.Router();
const data = require("../data/recipes");
const xss = require("xss");

router.get("/", async (req, res) => {
  res.render("recipes/index");
});

router.get("/addRecipe", async (req, res) => {
  res.render("recipes/addRecipe");
});

router.get("/:id", async (req, res) => {
  try {
    req.params.id = req.params.id.trim();
    const recipe = await data.getRecipeById(req.params.id);
    res.render("recipes/showDetails", { title: "Show Found", result: recipe });
  } catch (e) {
    res.status(404).json({ error: "Recipe not found" });
  }
});

router.post("/", async (req, res) => {
  const recipeData = req.body;

  if (!recipeData.recipeName) {
    res.status(400).json({ error: "You must provide recipe Name " });
    return;
  }
  if (!recipeData.alcohol) {
    res.status(400).json({ error: "You must provide Alcohol " });
    return;
  }
  if (!recipeData.ingredients) {
    res.status(400).json({ error: "You must provide Ingredients " });
    return;
  }
  if (!recipeData.recipeBody) {
    res.status(400).json({ error: "You must provide Recipe " });
    return;
  }
  if (!recipeData.tasteScale) {
    res.status(400).json({ error: "You must provide Taste Scale " });
    return;
  }

  // if (!recipeData.youtubeLink) {
  //     res.status(400).json({ error: 'You must provide Youtube Link ' });
  //     return;
  // }

  try {
    const UserID = req.session.user._id;
    const {
      recipeName,
      alcohol,
      ingredients,
      recipeBody,
      tasteScale,
      youtubeLink,
    } = recipeData;
    const newRecipe = await data.addRecipe(
      xss(UserID),
      xss(recipeName),
      xss(alcohol),
      xss(ingredients),
      xss(recipeBody),
      xss(tasteScale),
      xss(youtubeLink)
    );
    if (newRecipe) {
      return res.redirect("/posts/add");
    }
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.delete("/:id", async (req, res) => {
  if (!req.params.id) {
    req.params.id = req.params.id.trim();
    res.status(400).json({ error: "You must insert ID to delete" });
    return;
  }
  try {
    await data.getRecipeById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Recipe not found" });
    return;
  }
  try {
    const deletedRecipe = await data.removeRecipe(req.params.id);
    res.json(deletedRecipe);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.patch("/:id", async (req, res) => {
  const requestBody = req.body;
  req.params.id = req.params.id.trim();
  let updatedObject = {};
  try {
    const oldRecipe = await data.getRecipeById(req.params.id);
    if (requestBody.creator && requestBody.creator !== oldRecipe.creator)
      updatedObject.creator = requestBody.creator;
    if (
      requestBody.ingredients &&
      requestBody.ingredients !== oldRecipe.ingredients
    )
      updatedObject.ingredients = requestBody.ingredients;
    if (
      requestBody.tasteScale &&
      requestBody.tasteScale !== oldRecipe.tasteScale
    )
      updatedObject.tasteScale = requestBody.tasteScale;
    if (
      requestBody.youtubeLink &&
      requestBody.youtubeLink !== oldRecipe.youtubeLink
    )
      updatedObject.youtubeLink = requestBody.youtubeLink;
  } catch (e) {
    res.status(404).json({ error: "Recipe not found" });
    return;
  }
  if (Object.keys(updatedObject).length != 0) {
    try {
      const updatedRecipe = await data.patchUpdateRecipe(
        req.params.id,
        updatedObject
      );
      res.json(updatedRecipe);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  } else {
    res.status(400).json({
      error:
        "No fields have been changed from their inital values, so no update has occurred",
    });
  }
});

module.exports = router;

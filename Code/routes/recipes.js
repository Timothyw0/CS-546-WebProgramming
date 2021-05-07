const express = require('express');
const router = express.Router();
const data = require('../data/recipes');


router.get('/', async (req, res) => {
    res.render('recipes/index');
});

router.get('/insertDetails', async (req, res) => {
    res.render('recipes/insertDetails');
});

router.get('/:id', async (req, res) => {
    try {
        req.params.id = req.params.id.trim();
        const recipe = await data.getRecipeById(req.params.id);
        res.json(recipe);
    } catch (e) {
        res.status(404).json({ error: 'Recipe not found' });
    }
});

router.post('/', async (req, res) => {
    const recipeData = req.body;
    try {
        const { alcohol, ingredients,recipeUser, tasteScale, youtubeLink } = recipeData;
        const newRecipe = await data.addRecipe(alcohol, ingredients,recipeUser, tasteScale, youtubeLink);
        if (newRecipe) {
            return res.redirect('/recipes');
        }
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.delete('/:id', async (req, res) => {
    if (!req.params.id) {
        req.params.id = req.params.id.trim();
        res.status(400).json({ error: 'You must Supply and ID to delete' });
        return;
    }
    try {
        await data.getRecipeById(req.params.id);
    } catch (e) {
        res.status(404).json({ error: 'Recipe not found' });
        return;
    }
    try {
        const deletedRecipe = await data.removeRecipe(req.params.id);
        res.json(deletedRecipe);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.patch('/:id', async (req, res) => {
    const requestBody = req.body;
    req.params.id = req.params.id.trim();
    let updatedObject = {};
    try {
        const oldRecipe = await data.getRecipeById(req.params.id);
        if (requestBody.creator && requestBody.creator !== oldRecipe.creator)
            updatedObject.creator = requestBody.creator;
        if (requestBody.ingredients && requestBody.ingredients !== oldRecipe.ingredients)
            updatedObject.ingredients = requestBody.ingredients;
        if (requestBody.tasteScale && requestBody.tasteScale !== oldRecipe.tasteScale)
            updatedObject.tasteScale = requestBody.tasteScale;
        if (requestBody.youtubeLink && requestBody.youtubeLink !== oldRecipe.youtubeLink)
            updatedObject.youtubeLink = requestBody.youtubeLink;


    } catch (e) {
        res.status(404).json({ error: 'Recipe not found' });
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
                'No fields have been changed from their inital values, so no update has occurred'
        });
    }
});

module.exports = router;
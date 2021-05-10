const express = require("express");
const router = express.Router();
const xss = require("xss");
const searchData = require("../data/search");
const validator = require('../data/validation');

router.get('/recipe', async (req, res) => { 
    if(!req.session.user) {
        res.redirect('/');
    } else {
        res.render('search/recipe', {title: 'Recipe Search'});
    }
});

router.post('/recipe', async (req, res) => { 
    let errors = [];
    const alcToSearch = xss(req.body.alcohol.toLowerCase().trim());

    try {
        const recipes = await searchData.getRecipeByAlc(alcToSearch);
        return res.render('search/recipes', {
            title: `Results for ${alcohol}`,
            recipes: recipes 
        });
    } catch (e) {
        errors.push(e);
        res.render('search/recipes', {
            title: `Results for ${alcohol}`,
            errors: errors 
        });
    }
});

module.exports = router;
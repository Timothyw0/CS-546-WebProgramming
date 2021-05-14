const express = require("express");
const router = express.Router();
const xss = require("xss");
const searchData = require("../data/search");
const userData = require("../data/userData")
const validator = require('../data/validation');

router.get('/recipe', async (req, res) => { 
    if(!req.session.user) {
        res.redirect('/');
    } else {
        res.render('search/recipes', {title: 'Recipe Search'});
    }
});

router.post('/recipe', async (req, res) => { 
    let errors = [];
    if(!validator.validString(req.body.alcohol)) errors.push('Invalid alcohol search term')
    const alcToSearch = xss(req.body.alcohol.toLowerCase().trim());

    if (errors.length > 0) {
        return res.render('search/recipes', {
            title: `Results for ${req.body.alcohol}`,
            searchTerm: req.body.alcohol,
            errors: errors 
        });
    }

    try {
        const recipes = await searchData.getRecipeByAlc(alcToSearch);
        return res.render('search/recipes', {
            title: `Results for ${req.body.alcohol}`,
            recipes: recipes 
        });
    } catch (e) {
        errors.push(e);
        return res.status(404).render('search/recipes', {
            title: `Results for ${req.body.alcohol}`,
            searchTerm: req.body.alcohol,
            errors: errors 
        });
    }
});

router.get('/user', async (req, res) => { 
    if(!req.session.user) {
        res.redirect('/');
    } else {
        res.render('search/user', {title: 'User Search'});
    }
});

router.post('/user', async (req, res) => { 
    let errors = [];
    if(!validator.validString(req.body.searchUsername)) errors.push('No User Profile Found')
    const usernameToSearch = xss(req.body.searchUsername.toLowerCase().trim());
    console.log(usernameToSearch)
    if (errors.length > 0) {
        return res.render('search/user', {
            title: 'User Search',
            searchTerm: req.body.searchUsername,
            errors: errors 
        });
    }

    try {
        const userFound = await userData.findUserByUsername(usernameToSearch);
        const userID = userFound._id;
        console.log("USER ID: ")
        console.log(userID)
        if (userID)
        {
            res.redirect(`/users/profile/${userID}`);
        }
        else
        {
            errors.push("User Profile Not Found")
            return res.render('search/user', {
                title: 'User Search',
                searchTerm: req.body.searchUsername,
                errors: errors 
            });
        }
    } catch (e) {
        errors.push("No User Found");
        return res.status(404).render('search/user', {
            title: 'User Search',
            searchTerm: req.body.searchUsername,
            errors: errors 
        });
    }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const xss = require("xss");
const userData = require("../data/userData");
const bcrypt = require('bcrypt');

router.post('/login', async(res, req) => {
    let errors = [];
    const username = xss(req.body.username.toLowerCase().trim());
    const password = xss(req.body.password.trim());
    const userFound = await userData.findUserByUsername(username);

    if(!userFound) errors.push('Invalid Username or Password')
    if(errors.length > 0) {
        return res.status(401).render('/login', {
            title: 'Log In',
            errors: errors
        });
    }

    let match = await bcrypt.compare(password, userFound.hashedPassword);
    if (match) {
        req.session.user = {
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            username: userFound.username,
            email: userFound.email,
            dateOfBirth: userFound.dateOfBirth,
            friends: userFound.friends,
            posts: userFound.posts,
            recipes: userFound.recipes,
            comments: userFound.comments,
            profilePicture: userFound.profilePicture
        };
        return res.redirect('/feed')
    } else {
        errors.push('Invalid Username or Password');
        return res.status(401).render('/login', {
            title: 'Log In',
            errors: errors
        });
    }
});
const express = require("express");
const router = express.Router();
const xss = require("xss");
const userData = require("../data/userData");
const bcrypt = require('bcrypt');
const validator = require('../data/validation')

router.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect('/feed');
    } else {
        res.render('users/login', {title: 'Log In'});
    }
});

router.post('/login', async(res, req) => {
    let errors = [];
    const username = xss(req.body.username.toLowerCase().trim());
    const password = xss(req.body.password.trim());
    const userFound = await userData.findUserByUsername(username);

    if(!userFound) errors.push('Invalid Username or Password')
    if(errors.length > 0) {
        return res.status(401).render('users/login', {
            title: 'Log In',
            errors: errors
        });
    }

    let match = await bcrypt.compare(password, userFound.hashedPassword);
    if (match) {
        req.session.user = {
            _id: userFound._id,
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
        return res.status(401).render('users/login', {
            title: 'Log In',
            errors: errors
        });
    }
});

router.post('/signup', async (req, res) => {
    let errors = [];
    let newUser = {
        firstName: xss(req.body.firstName),
        lastName: xss(req.body.lastName),
        username: xss(req.body.username),
        email: xss(req.body.email),
        dateOfBirth: xss(req.body.dateOfBirth),
        password: xss(req.body.password)
    }

    if(!validator.validString(newUser.firstName)) errors.push('Invalid first name.');
    if(!validator.validString(newUser.lastName)) errors.push('Invalid last name.');
    if(!validator.validString(newUser.username)) errors.push('Invalid username.');
    if(!validator.validString(newUser.password)) errors.push('Invalid password.');
    if(!validator.validEmail(newUser.email)) errors.push('Invalid email.');
    if(!validator.validDate(newUser.dateOfBirth)) errors.push('Invalid Date of Birth.');

    if(errors.length > 0) {
        return res.status(401).render('users/signup', {
            title: 'Sign Up',
            errors: errors,
            signupInfo: newUser
        });
    }

    let userCheck = await userData.findUserByUsername(newUser.username);
    if (!userCheck) {
        errors.push('Username already in use.');
        return res.status(401).render('users/signup', {
            title: 'Sign Up',
            errors: errors,
            signupInfo: newUser
        });
    }
});
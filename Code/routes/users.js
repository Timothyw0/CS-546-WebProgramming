const express = require("express");
const router = express.Router();
const xss = require("xss");
const userData = require("../data/userData");
const postData = require("../data/posts");
const bcrypt = require('bcrypt');
const validator = require('../data/validation')

router.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect('/feed');
    } else {
        res.redirect('/login', {title: 'Log In'});
    }
});

router.get('/login', async (req, res) => {
    res.render('users/login', {title: 'Log In'})
})

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

router.get('/signup', async (req, res) => {
    res.render('users/signup', {title: 'Sign Up'})
})

router.post('/signup', async (req, res) => {
    let errors = [];
    let newUser = {
        firstName: xss(req.body.firstName.trim()),
        lastName: xss(req.body.lastName.trim()),
        username: xss(req.body.username.toLowerCase().trim()),
        email: xss(req.body.email.toLowerCase().trim()),
        dateOfBirth: xss(req.body.dateOfBirth.trim()),
        password: xss(req.body.password.trim())
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

    try {
        const addedUser = await userData.createUser(
            newUser.firstName,
            newUser.lastName,
            newUser.lastName,
            newUser.email,
            newUser.dateOfBirth,
            newUser.password
        );

        req.session.user = {
            _id: addedUser._id,
            firstName: addedUser.firstName,
            lastName: addedUser.lastName,
            username: addedUser.username,
            email: addedUser.email,
            dateOfBirth: addedUser.dateOfBirth,
            friends: addedUser.friends,
            posts: addedUser.posts,
            recipes: addedUser.recipes,
            comments: addedUser.comments,
            profilePicture: addedUser.profilePicture
        };
        res.redirect('/feed');
    } catch(e) {
        errors.push(e);
        res.status(403).render('users/signup', {
            title: signUp,
            userInfo: newUser,
            errors: errors
        });
    }
});

router.get('/profile/:id', async (req, res) => {
    let errors = [];
    const userFound = await userData.getUserById(req.params.id)
    if(!userFound) {
        errors.push('User not found');
        // maybe we make a 404 page to render when something is not found
        return res.status(404).render('users/not-found', {
            title: 'Not Found',
            errors: errors
        });
    }

    const userPosts = await postData.getPostByUser(userFound._id);
    if(!userPosts) {
        errors.push('User posts not found');
        // maybe we make a 404 page to render when something is not found
        return res.status(404).render('users/not-found', {
            title: 'Not Found',
            errors: errors
        });
    }
    res.render('users/profile', {
        title: req.session.user.username,
        user: {
            _id: userFound._id,
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            username: userFound.username,
            email: userFound.email,
            dateOfBirth: userFound.dateOfBirth,
            friends: userFound.friends,
            posts: userPosts,
            recipes: userFound.recipes,
            comments: userFound.comments,
            profilePicture: userFound.profilePicture
        }
    });
});

router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
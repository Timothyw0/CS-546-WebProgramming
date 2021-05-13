const express = require("express");
const router = express.Router();
const xss = require("xss");
const userData = require("../data/userData");
const postData = require("../data/posts");
const bcrypt = require("bcrypt");
const validator = require("../data/validation");
const multer = require('multer');
const path = require('path');

router.get("/", async (req, res) => {
  if (req.session.user) {
    res.redirect("/feed");
  } else {
    res.redirect("/login");
  }
});

router.get("/login", async (req, res) => {
  res.render("users/login", { title: "Log In" });
});

router.post("/login", async (req, res) => {
  let errors = [];
  const username = xss(req.body.username.toLowerCase().trim());
  const password = xss(req.body.password.trim());
  const userFound = await userData.findUserByUsername(username);

  if (!userFound) errors.push("Invalid Username or Password");
  if (errors.length > 0) {
    return res.status(401).render("users/login", {
      title: "Log In",
      errors: errors,
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
      following: userFound.following,
      posts: userFound.posts,
      recipes: userFound.recipes,
      comments: userFound.comments,
      profilePicture: userFound.profilePicture,
    };
    return res.redirect("/feed");
  } else {
    errors.push("Invalid Username or Password");
    return res.status(401).render("users/login", {
      title: "Log In",
      errors: errors,
    });
  }
});

router.get("/signup", async (req, res) => {
  res.render("users/signup", { title: "Sign Up" });
});

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
    if(!validator.validPassword(newUser.password)) errors.push('Invalid password.');
    if(!validator.validEmail(newUser.email)) errors.push('Invalid email.');
    if(!validator.validDate(newUser.dateOfBirth)) errors.push('Invalid Date of Birth.');

    if(errors.length > 0) {
        return res.status(401).render('users/signup', {
            title: 'Sign Up',
            errors: errors,
            signupInfo: newUser
        });
    }

    const userCheck = await userData.findUserByUsername(newUser.username);
    try {
        if (userCheck) throw 'Username already in use.';
    } catch (e) {
        errors.push(e);
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
            following: addedUser.following,
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

router.get('/users/profile/:id', async (req, res) => {
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

    let isFollowing;
    if(req.session.user.following.includes(req.params.id)) {
        isFollowing = true;
    } else {
        isFollowing = false;
    }

    if (userFound.profilePicture !== "") {
      userFound.profilePicture = userFound.profilePicture.image.buffer
    }
    res.render('users/profile', {
        title: userFound.username,
        userInfo: {
            _id: userFound._id,
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            username: userFound.username,
            email: userFound.email,
            dateOfBirth: userFound.dateOfBirth,
            following: userFound.following,
            posts: userPosts,
            recipes: userFound.recipes,
            comments: userFound.comments,
            profilePicture: userFound.profilePicture,
            isFollowing: isFollowing
        }
    });
});

router.get("/users/profile/edit", async (req, res) => {
  res.render("users/edit", {
    title: "Edit Profile",
    userInfo: req.session.user,
  });
});

router.patch("/users/profile/edit", async (req, res) => {
  const updateInfo = {};
  const reqBody = {
    firstName: xss(req.body.firstName.trim()),
    lastName: xss(req.body.lastName.trim()),
    username: xss(req.body.username.toLowerCase().trim()),
    email: xss(req.body.email.toLowerCase().trim()),
    dateOfBirth: xss(req.body.dateOfBirth.trim()),
  };

  if (!validator.validString(reqBody.firstName))
    errors.push("Invalid first name.");
  if (!validator.validString(reqBody.lastName))
    errors.push("Invalid last name.");
  if (!validator.validString(reqBody.username))
    errors.push("Invalid username.");
  if (!validator.validEmail(reqBody.email)) errors.push("Invalid email.");
  if (!validator.validDate(reqBody.dateOfBirth))
    errors.push("Invalid Date of Birth.");

  if (errors.length > 0) {
    return res.status(401).render("users/edit", {
      title: "Edit Profile",
      errors: errors,
      userInfo: req.session.user,
    });
  }

  try {
    const oldUser = await userData.getUserById(req.session.user._id);
    if (reqBody.firstName && reqBody.firstName !== oldUser.firstName) {
      updateInfo.firstName = reqBody.firstName;
    }

    if (reqBody.lastName && reqBody.lastName !== oldUser.lastName) {
      updateInfo.lastName = reqBody.lastName;
    }

    if (reqBody.username && reqBody.username !== oldUser.username) {
      updateInfo.username = reqBody.username;
      let userCheck = await userData.findUserByUsername(reqBody.username);
      if (userCheck) throw "Username already exists.";
    }

    if (reqBody.email && reqBody.email !== oldUser.email) {
      updateInfo.email = reqBody.email;
    }

    if (reqBody.dateOfBirth && reqBody.dateOfBirth !== oldUser.dateOfBirth) {
      updateInfo.dateOfBirth = reqBody.dateOfBirth;
    }
  } catch (e) {
    errors.push(e);
    return res.status(500).render("users/edit", {
      title: "Edit Profile",
      errors: errors,
      userInfo: req.session.user,
    });
  }

  try {
    if (Object.keys(updateInfo).length > 0) {
      const updatedUser = await userData.updateUser(
        req.session.user._id,
        updateInfo
      );

      req.session.user.firstName = updatedUser.firstName;
      req.session.user.lastName = updatedUser.lastName;
      req.session.user.username = updatedUser.username;
      req.session.user.email = updatedUser.email;
      req.session.user.dateOfBirth = updatedUser.dateOfBirth;
    }

    return res.redirect(`/profile/${req.session.user._id}`);
  } catch (e) {
    errors.push(e);
    return res.status(500).render("users/edit", {
      title: "Edit Profile",
      errors: errors,
      userInfo: req.session.user,
    });
  }
});


router.post('/users/follow/:id', async (req, res) => {
    try {
        const updated = await userData.addFollowingToUser(req.session.user._id, req.params.id)
        req.session.user.following = updated.following;
        res.redirect(`users/profile/${req.params.id}`)
    } catch(e) {
        return res.redirect(`users/profile/${req.params.id}`);
    }
});

var fs = require('fs');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage })

router.post('/users/upload/picture', upload.single('picture'), async (req, res) => {
  try {
    console.log(req.file);
    var profilePic = fs.readFileSync(req.file.path)
    var encodedProfilePic = profilePic.toString('base64');
    var picToAdd = {
      contentType: req.file.mimetype,
      image: Buffer.from(encodedProfilePic, 'base64')
    }
    const updatedWithPic = await userData.addProfilePhotoToUser(req.session.user._id, picToAdd);
    req.session.user = updatedWithPic;
    res.redirect(`users/profile/${updatedWithPic._id}`);
  } catch (error) {
    res.status(404).render('users/profile', {
      title: req.session.user.username,
      userInfo: req.session.user,
      error: error
    });
  }
});

router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;

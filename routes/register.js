const session = require('express-session')
var express = require('express');
var router = express.Router();
const User = require('../models/userModel')
const isLoggedIn = require('./auth');
const passport = require("passport");
const LocalStrategy = require("passport-local");
var upload = require("../utils/multer")
passport.use(new LocalStrategy(User.authenticate()));


router.get('/register', (req, res) => {
    res.render('register')
  })
  
  router.post('/register', upload.single('dp'), async function (req, res, next) {
    try {
      console.log(req.body);
      const existingUser = await User.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }],
      });
  
      if (existingUser) {
        return res.status(400).send('Username or email is already in use.');
      }
      await User.register(
        {
          username: req.body.username,
          email: req.body.email,
          phone: req.body.phone,
          dp: req.file.filename,
        },
        req.body.password
      );
  
      res.redirect('/login');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error registering new user, please try again.');
    }
  });
  module.exports = router;

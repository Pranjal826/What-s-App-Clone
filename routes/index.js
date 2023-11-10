var express = require('express');
var router = express.Router();
const session = require('express-session');
const User = require('../models/userModel');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const upload = require("../utils/multer");
const isLoggedIn = require('./auth');
const flash = require('connect-flash');

passport.use(new LocalStrategy(User.authenticate()));

router.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
router.use(flash());

router.get('/', isLoggedIn, async(req, res) => {
  
  const flashMessage = req.flash('success');
  try {
    const currentuser = req.user;
    const users = await User.find({ _id: { $ne: currentuser._id } });

    res.render('index', { users, currentuser, loggedIn: true, flashMessage });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user list.');
  }
});

module.exports = router;

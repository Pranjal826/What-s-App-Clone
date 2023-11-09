var express = require('express');
var router = express.Router();
const session = require('express-session')
const User = require('../models/userModel')
var upload = require("../utils/multer").single("dp");
const passport = require("passport");
const LocalStrategy = require("passport-local");
var upload = require("../utils/multer")
passport.use(new LocalStrategy(User.authenticate()));
// passport.use(User.createStrategy());
/* GET home page. */

router.get('/', isLoggedIn, async (req, res) => {
  try {
    // Fetch the current user using Passport
    const currentuser = req.user;

    // Fetch other users excluding the current user
    const users = await userModel.find({ _id: { $ne: currentuser._id } });

    res.render('index', { users, currentuser, loggedIn: true });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user list.');
  }
});



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




router.get('/login',isLoggedIn, (req, res) => {
  res.render('login')
})
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
}), (req, res) => {
});
router.get('/logout', (req, res) => {
  // If you're using Passport for authentication, use its logout method
  req.logout();

  // Destroy the session
  req.session.destroy();

  // Redirect to the login page
  res.redirect('/login');
});







router.get('/showprofile',isLoggedIn, (req, res) => {
  // Show profile of currently logged in user
  const currentuser = req.session.user;
  res.render('showprofile', { currentuser: currentuser });
})

router.get('/delete', isLoggedIn, async (req, res) => {
  const currentuser = req.session.user;
  try {
    await userModel.findByIdAndRemove(currentuser._id);
    req.session.destroy();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting the profile.');
  }
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      next();
  } else {
      res.redirect("/login");
  }
}
module.exports = router;

var express = require('express');
var router = express.Router();
const session=require('express-session')
const userModel=require('../models/userModel')

/* GET home page. */
router.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
function checkAuth(req, res, next) {
  if (req.session.user) {
    next(); // User is authenticated, proceed to the next middleware
  } else {
    res.redirect('/login'); // User is not authenticated, redirect to the login page
  }
}
router.get('/', checkAuth,async(req, res) => {
  try {
    const loggedInUser = req.session.user;
    const users = await userModel.find({ _id: { $ne: loggedInUser._id } });
    const currentuser = req.session.user;
    res.render('index', { users ,currentuser: currentuser,loggedIn:true});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user list.');
  }
});

router.get('/register',(req,res)=>{
  res.render('register')
})

router.post('/register', async (req, res) => {
  const { name, email, password, phone, dp } = req.body;

  // Check if the email, phone, and name are already in use
  const existingUser = await userModel.findOne({ $or: [{ email }, { phone }, { name }] });

  if (existingUser) {
    // A user with the same email, phone, or name already exists
    res.status(400).send('Email, phone, or username is already in use.');
  } else {
    // Create a new user if no user with the same email, phone, or name exists
    const registration = new userModel({
      name,
      email,
      password,
      phone,
      dp,
    });

    try {
      await registration.save();
      res.send(`
        <script>
          alert("Registration Successful");
          window.location = '/login'; // Redirect to the login page
        </script>
      `);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error saving registration data.');
    }
  }
});

router.get('/login',(req,res)=>{
  res.render('login')
})
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email, password });

    if (user) {
      req.session.user = user;
      res.redirect('/');
    } else {
      res.send('Incorrect email or password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during login.');
  }
});
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

router.get('/showprofile',(req,res)=>{
  // Show profile of currently logged in user
  const currentuser = req.session.user;
  res.render('showprofile', { currentuser: currentuser });
})

router.get('/delete', checkAuth, async (req, res) => {
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

module.exports = router;

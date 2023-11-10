const session = require('express-session')
var express = require('express');
var router = express.Router();
const User = require('../models/userModel')
const isLoggedIn = require('./auth');
const passport = require("passport");
const LocalStrategy = require("passport-local");
var upload = require("../utils/multer")
const { escapeScriptTag } = require('../utils/security');
passport.use(new LocalStrategy(User.authenticate()));


router.get('/register', (req, res) => {
    res.render('register')
  })
  
 
  router.post('/register', upload.single('dp'), async function (req, res, next) {
    try {
        console.log(req.body);

        // Validate password format before setting
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
        if (!passwordRegex.test(req.body.password)) {
            // Display SweetAlert error message for invalid password
            const errorMessage = 'Password must meet the specified criteria.';
            return res.send(`
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
                <script>
                    document.addEventListener('DOMContentLoaded', function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: '${escapeScriptTag(errorMessage)}',
                        }).then(() => {
                            window.location.href = '/register'; // Redirect to registration page
                        });
                    });
                </script>
            `);
        }

        const existingUser = await User.findOne({
            $or: [{ username: req.body.username }, { email: req.body.email }],
        });

        if (existingUser) {
            // Display SweetAlert error message for existing user
            const errorMessage = 'Username or email is already in use.';
            return res.send(`
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
                <script>
                    document.addEventListener('DOMContentLoaded', function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: '${escapeScriptTag(errorMessage)}',
                        }).then(() => {
                            window.location.href = '/register'; // Redirect to registration page
                        });
                    });
                </script>
            `);
        }

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            dp: req.file.filename,
        });

        // Set the password using setPassword method
        await user.setPassword(req.body.password);

        // Save the user to the database
        await user.save();

        // Display SweetAlert success message for successful registration
        const successMessage = 'Registration successful! You can now log in.';
        return res.send(`
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            <script>
                document.addEventListener('DOMContentLoaded', function () {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: '${escapeScriptTag(successMessage)}',
                    }).then(() => {
                        window.location.href = '/login'; // Redirect to login page
                    });
                });
            </script>
        `);
    } catch (error) {
        console.error(error);
        // Display SweetAlert error message for general registration error
        const errorMessage = 'Error registering new user. Please try again.';
        return res.send(`
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            <script>
                document.addEventListener('DOMContentLoaded', function () {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: '${escapeScriptTag(errorMessage)}',
                    }).then(() => {
                        window.location.href = '/register'; // Redirect to registration page
                    });
                });
            </script>
        `);
    }
});
  module.exports = router;

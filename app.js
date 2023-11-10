
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const loginRoutes=require('./routes/login')
const logoutRoutes=require('./routes/logout')
const registerRoutes=require('./routes/register')
const profileRoutes=require('./routes/profile')
const deleteRoutes=require('./routes/delete')
const flash = require('connect-flash');

// db connected
require("./models/config");

const passport = require("passport");
const session = require("express-session");

const User = require("./models/userModel");

var indexRouter = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// passport session boilerplate
app.use(
    session({
        saveUninitialized: true,
        resave: true,
        secret: "asdhbcfkjf",
    })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", indexRouter);
app.use("/", loginRoutes);
app.use("/", logoutRoutes);
app.use("/", registerRoutes);
app.use("/", profileRoutes);
app.use("/", deleteRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
 
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
